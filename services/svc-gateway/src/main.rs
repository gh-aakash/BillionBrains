use axum::{
    routing::{get, post},
    Router, Json, extract::State,
    http::{StatusCode, Method},
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};
use shared_proto::user::user_service_client::UserServiceClient;
use shared_proto::idea::idea_service_client::IdeaServiceClient;
use tonic::transport::Channel;

#[derive(Clone)]
struct AppState {
    user_client: UserServiceClient<Channel>,
    idea_client: IdeaServiceClient<Channel>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    // In a real app, these URIs would come from env vars
    let user_service_url = "http://127.0.0.1:50051";
    let idea_service_url = "http://127.0.0.1:50052";

    println!("Connecting to services...");
    // Connect lazily
    let user_client = UserServiceClient::connect(user_service_url).await.or_else(|e| {
        println!("Warning: Could not connect to User Service: {}", e);
        // Return a broken client or handle retry. For MVP we panic or retry loop
        // But here we rely on tonic's lazy connection (requires Endpoint to be built properly)
         UserServiceClient::connect(user_service_url) // This creates a future, we need Endpoint::connect to be lazy really
    }); 
    
    // Better way for startup resilience:
    let user_channel = Channel::from_static(user_service_url).connect_lazy();
    let idea_channel = Channel::from_static(idea_service_url).connect_lazy();

    let state = AppState {
        user_client: UserServiceClient::new(user_channel),
        idea_client: IdeaServiceClient::new(idea_channel),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST]);

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/users", post(create_user))
        .route("/api/ideas", get(list_ideas).post(create_idea))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    println!("Gateway listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn health_check() -> &'static str {
    "OK"
}

// --- Handlers ---

#[derive(Deserialize)]
struct CreateUserPayload {
    username: String,
    full_name: String,
    bio: String,
}

async fn create_user(
    State(mut state): State<AppState>,
    Json(payload): Json<CreateUserPayload>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let req = shared_proto::user::CreateUserRequest {
        username: payload.username,
        full_name: payload.full_name,
        bio: payload.bio,
    };

    let resp = state.user_client.create_user(req).await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let user = resp.into_inner();
    Ok(Json(serde_json::json!({
        "id": user.id,
        "username": user.username
    })))
}

#[derive(Deserialize)]
struct CreateIdeaPayload {
    title: String,
    problem: String,
    solution: String,
    creator_id: String,
}

async fn create_idea(
    State(mut state): State<AppState>,
    Json(payload): Json<CreateIdeaPayload>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let req = shared_proto::idea::CreateIdeaRequest {
        title: payload.title,
        problem: payload.problem,
        solution: payload.solution,
        creator_id: payload.creator_id,
    };

    let resp = state.idea_client.create_idea(req).await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let idea = resp.into_inner();
    Ok(Json(serde_json::json!({
        "id": idea.id,
        "title": idea.title,
        "status": idea.status
    })))
}

async fn list_ideas(
    State(mut state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let req = shared_proto::idea::ListIdeasRequest {
        page_size: 10,
        page_token: "".into(),
    };

    let resp = state.idea_client.list_ideas(req).await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let ideas = resp.into_inner().ideas;
    
    // Manual mapping or serde impls if we added them to proto structs (requires modification to build.rs)
    // For now simple manual JSON construction
    let json_ideas: Vec<_> = ideas.into_iter().map(|i| {
        serde_json::json!({
            "id": i.id,
            "title": i.title,
            "problem": i.problem
        })
    }).collect();

    Ok(Json(serde_json::json!({ "ideas": json_ideas })))
}
