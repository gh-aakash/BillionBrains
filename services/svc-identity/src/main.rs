mod config;
mod db;

use tonic::{transport::Server, Request, Response, Status};
use tracing_subscriber::FmtSubscriber;
use shared_proto::user::user_service_server::{UserService, UserServiceServer};
use shared_proto::user::{User, GetUserRequest, CreateUserRequest};

#[derive(Debug, Default)]
pub struct MyUserService {}

#[tonic::async_trait]
impl UserService for MyUserService {
    async fn get_user(&self, request: Request<GetUserRequest>) -> Result<Response<User>, Status> {
        let req = request.into_inner();
        // TODO: Fetch from DB
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
        // TODO: Save to DB
        let reply = User {
            id: uuid::Uuid::new_v4().to_string(),
            username: req.username,
            full_name: req.full_name,
            bio: req.bio,
        };
        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::new())?;
    
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
