mod config;
mod db;

use tonic::{transport::Server, Request, Response, Status};
use tracing_subscriber::FmtSubscriber;
use shared_proto::user::user_service_server::{UserService, UserServiceServer};
use shared_proto::user::{User, GetUserRequest, CreateUserRequest, LoginRequest, LoginResponse};
use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Default)]
pub struct MyUserService {}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

#[tonic::async_trait]
impl UserService for MyUserService {
    async fn get_user(&self, request: Request<GetUserRequest>) -> Result<Response<User>, Status> {
        let req = request.into_inner();
        let reply = User {
            id: req.id,
            username: "mock_user".into(),
            full_name: "Mock User".into(),
            bio: "Mock Bio".into(),
        };
        Ok(Response::new(reply))
    }

    async fn create_user(&self, request: Request<CreateUserRequest>) -> Result<Response<User>, Status> {
        let req = request.into_inner();
        let reply = User {
            id: uuid::Uuid::new_v4().to_string(),
            username: req.username,
            full_name: req.full_name,
            bio: req.bio,
        };
        Ok(Response::new(reply))
    }

    async fn login(&self, request: Request<LoginRequest>) -> Result<Response<LoginResponse>, Status> {
        let req = request.into_inner();

        // Hardcoded Credential Check (Demo)
        if req.email == "test@example.com" && req.password == "password" {
            
            let expiration = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs() as usize + 3600; // 1 hour

            let claims = Claims {
                sub: req.email.clone(),
                exp: expiration,
            };

            let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "supersecretkey123".to_string());
            let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_bytes()))
                .map_err(|e| Status::internal(format!("Token error: {}", e)))?;

            let reply = LoginResponse {
                token,
                user: Some(User {
                    id: "user-123".to_string(),
                    username: "demo_user".to_string(),
                    full_name: "Demo User".to_string(),
                    bio: "I am a demo user".to_string(),
                }),
            };
            
            Ok(Response::new(reply))
        } else {
            Err(Status::unauthenticated("Invalid email or password"))
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::new())?;
    
    // DB code commented out for now as we use Mock logic
    // let config = config::Config::from_env().expect("Failed to load config");
    // let db_pool = db::init_pool(&config.database_url).await?;

    let addr = "0.0.0.0:50051".parse()?;
    let user_service = MyUserService::default();

    println!("UserService listening on {}", addr);

    Server::builder()
        .add_service(UserServiceServer::new(user_service))
        .serve(addr)
        .await?;

    Ok(())
}
