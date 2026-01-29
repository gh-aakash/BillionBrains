mod config;
mod db;

use tonic::{transport::Server, Request, Response, Status};
use tracing_subscriber::FmtSubscriber;
use shared_proto::user::user_service_server::{UserService, UserServiceServer};
use shared_proto::user::{User, GetUserRequest, CreateUserRequest, LoginRequest, LoginResponse};
use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};
use sqlx::{PgPool, Row};
use sqlx::postgres::PgPoolOptions;
use uuid::Uuid;

#[derive(Debug)]
pub struct MyUserService {
    pool: PgPool,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    user_id: String,
}

impl MyUserService {
    fn hash_password(password: &str) -> Result<String, Status> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2.hash_password(password.as_bytes(), &salt)
            .map_err(|e| Status::internal(format!("Hashing error: {}", e)))?
            .to_string();
        Ok(password_hash)
    }

    fn verify_password(password: &str, hash: &str) -> Result<bool, Status> {
        let parsed_hash = PasswordHash::new(hash)
            .map_err(|e| Status::internal(format!("Hash parsing error: {}", e)))?;
        Ok(Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok())
    }
}

#[tonic::async_trait]
impl UserService for MyUserService {
    async fn get_user(&self, request: Request<GetUserRequest>) -> Result<Response<User>, Status> {
        let req = request.into_inner();
        
        // Fix: Use Uuid::parse_str properly for query
        let user_uuid = Uuid::parse_str(&req.id).map_err(|_| Status::invalid_argument("Invalid UUID"))?;

        let row = sqlx::query("SELECT id, username, full_name, bio FROM users WHERE id = $1")
            .bind(user_uuid)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB Error: {}", e)))?;

        if let Some(row) = row {
            let user = User {
                id: row.get::<Uuid, _>("id").to_string(),
                username: "N/A".to_string(), 
                full_name: row.get("full_name"),
                bio: row.get("bio"),
            };
            Ok(Response::new(user))
        } else {
            Err(Status::not_found("User not found"))
        }
    }

    async fn create_user(&self, request: Request<CreateUserRequest>) -> Result<Response<User>, Status> {
        let req = request.into_inner();
        
        let email = req.username; 
        let password_raw = req.password; // Now available
        let role = if req.role.is_empty() { "creator".to_string() } else { req.role }; // Default to creator

        let password_hash = Self::hash_password(&password_raw)?; 
        let user_id = Uuid::new_v4();
        
        // Insert with Role and Password
        sqlx::query("INSERT INTO users (id, email, password_hash, full_name, bio, role) VALUES ($1, $2, $3, $4, $5, $6)")
            .bind(user_id)
            .bind(&email)
            .bind(password_hash)
            .bind(&req.full_name)
            .bind(&req.bio)
            .bind(&role)
            .execute(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("Failed to create user (Email might exist): {}", e)))?;

        let reply = User {
            id: user_id.to_string(),
            username: email,
            full_name: req.full_name,
            bio: req.bio,
        };
        Ok(Response::new(reply))
    }

    async fn login(&self, request: Request<LoginRequest>) -> Result<Response<LoginResponse>, Status> {
        let req = request.into_inner();

        let row = sqlx::query("SELECT id, password_hash, full_name, bio FROM users WHERE email = $1")
            .bind(&req.email)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB Error: {}", e)))?;

        if let Some(row) = row {
            let stored_hash: String = row.get("password_hash");
            let user_id: Uuid = row.get("id");
            
            if Self::verify_password(&req.password, &stored_hash)? {
                 let expiration = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs() as usize + 3600 * 24; 

                let claims = Claims {
                    sub: req.email.clone(),
                    exp: expiration,
                    user_id: user_id.to_string(),
                };

                let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "supersecretkey123".to_string());
                let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_bytes()))
                    .map_err(|e| Status::internal(format!("Token error: {}", e)))?;

                Ok(Response::new(LoginResponse {
                    token,
                    user: Some(User {
                        id: user_id.to_string(),
                        username: req.email,
                        full_name: row.get("full_name"),
                        bio: row.get("bio"),
                    }),
                }))
            } else {
                 Err(Status::unauthenticated("Invalid password"))
            }
        } else {
            Err(Status::unauthenticated("User not found"))
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::new())?;
    
    let config = config::Config::from_env().expect("Failed to load config");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await?;
        
    let addr = config.server_addr.parse()?;
    let user_service = MyUserService { pool };

    println!("UserService listening on {}", addr);

    Server::builder()
        .add_service(UserServiceServer::new(user_service))
        .serve(addr)
        .await?;

    Ok(())
}
