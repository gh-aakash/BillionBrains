use tonic::{transport::Server, Request, Response, Status};
use tracing_subscriber::FmtSubscriber;
use shared_proto::idea::idea_service_server::{IdeaService, IdeaServiceServer};
use shared_proto::idea::{Idea, CreateIdeaRequest, GetIdeaRequest, ListIdeasRequest, ListIdeasResponse};

#[derive(Debug, Default)]
pub struct MyIdeaService {}

#[tonic::async_trait]
impl IdeaService for MyIdeaService {
    async fn create_idea(&self, request: Request<CreateIdeaRequest>) -> Result<Response<Idea>, Status> {
        let req = request.into_inner();
        let reply = Idea {
            id: uuid::Uuid::new_v4().to_string(),
            title: req.title,
            problem: req.problem,
            solution: req.solution,
            creator_id: req.creator_id,
            status: 1, // Open
        };
        Ok(Response::new(reply))
    }

    async fn get_idea(&self, request: Request<GetIdeaRequest>) -> Result<Response<Idea>, Status> {
        let req = request.into_inner();
        Ok(Response::new(Idea {
            id: req.id,
            title: "Mock Idea".into(),
            problem: "Mock Problem".into(),
            solution: "Mock Solution".into(),
            creator_id: "user-123".into(),
            status: 1,
        }))
    }

    async fn list_ideas(&self, _request: Request<ListIdeasRequest>) -> Result<Response<ListIdeasResponse>, Status> {
        Ok(Response::new(ListIdeasResponse {
            ideas: vec![
                Idea {
                     id: "1".into(),
                     title: "Project Alpha".into(),
                     problem: "Problem A".into(),
                     solution: "Solution A".into(),
                     creator_id: "user-1".into(),
                     status: 1,
                }
            ],
            next_page_token: "".into(),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::new())?;
    
    let addr = "0.0.0.0:50052".parse()?;
    let idea_service = MyIdeaService::default();

    println!("IdeaService listening on {}", addr);

    Server::builder()
        .add_service(IdeaServiceServer::new(idea_service))
        .serve(addr)
        .await?;

    Ok(())
}
