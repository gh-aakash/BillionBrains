mod config;
mod db;

use tonic::{transport::Server, Request, Response, Status};
use tracing_subscriber::FmtSubscriber;
use shared_proto::idea::idea_service_server::{IdeaService, IdeaServiceServer};
use shared_proto::idea::{Idea, CreateIdeaRequest, GetIdeaRequest, ListIdeasRequest, ListIdeasResponse};
use shared_proto::task::task_service_server::{TaskService, TaskServiceServer};
use shared_proto::task::{Task, Project, CreateTaskRequest, ListTasksRequest, ListTasksResponse, CreateProjectRequest, ListProjectsRequest, ListProjectsResponse, UpdateTaskRequest, UpdateTaskResponse};
use sqlx::{PgPool, Row};
use sqlx::postgres::PgPoolOptions;
use uuid::Uuid;

#[derive(Debug)]
pub struct MyIdeaService {
    pool: PgPool,
}

#[tonic::async_trait]
impl IdeaService for MyIdeaService {
    async fn create_idea(&self, request: Request<CreateIdeaRequest>) -> Result<Response<Idea>, Status> {
        let req = request.into_inner();
        let idea_id = Uuid::new_v4();
        let creator_id = Uuid::parse_str(&req.creator_id).unwrap_or(Uuid::nil());

        sqlx::query("INSERT INTO ideas (id, creator_id, title, problem, solution, status) VALUES ($1, $2, $3, $4, $5, $6)")
            .bind(idea_id)
            .bind(creator_id)
            .bind(&req.title)
            .bind(&req.problem)
            .bind(&req.solution)
            .bind("open")
            .execute(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB: {}", e)))?;

        Ok(Response::new(Idea {
            id: idea_id.to_string(),
            title: req.title,
            problem: req.problem,
            solution: req.solution,
            creator_id: creator_id.to_string(),
            status: 1,
        }))
    }

    async fn get_idea(&self, request: Request<GetIdeaRequest>) -> Result<Response<Idea>, Status> {
       // reuse existing logic from previous step, abbreviated for brevity of this focused update
       // For now, let's keep it simple or copy-paste previous logic if needed. 
       // To save context tokens, I assume get_idea logic is less critical for Project Mgmt task.
       // But I must implement it to compile!
       let req = request.into_inner();
       let idea_uuid = Uuid::parse_str(&req.id).map_err(|_| Status::invalid_argument("Invalid UUID"))?;
       let row = sqlx::query("SELECT id, creator_id, title, problem, solution, status FROM ideas WHERE id = $1")
            .bind(idea_uuid)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB: {}", e)))?;
        
        if let Some(row) = row {
             Ok(Response::new(Idea {
                id: row.get::<Uuid, _>("id").to_string(),
                title: row.get("title"),
                problem: row.get("problem"),
                solution: row.get("solution"),
                creator_id: row.get::<Uuid, _>("creator_id").to_string(),
                status: 1,
            }))
        } else {
             Err(Status::not_found("Idea not found"))
        }
    }

    async fn list_ideas(&self, _request: Request<ListIdeasRequest>) -> Result<Response<ListIdeasResponse>, Status> {
        let rows = sqlx::query("SELECT id, creator_id, title, problem, solution, status FROM ideas ORDER BY created_at DESC LIMIT 20")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB: {}", e)))?;

        let ideas = rows.into_iter().map(|row| {
            Idea {
                id: row.get::<Uuid, _>("id").to_string(),
                title: row.get("title"),
                problem: row.get("problem"),
                solution: row.get("solution"),
                creator_id: row.get::<Uuid, _>("creator_id").to_string(),
                status: 1,
            }
        }).collect();

        Ok(Response::new(ListIdeasResponse { ideas, next_page_token: "".into() }))
    }
}

// TASK SERVICE IMPLEMENTATION
#[derive(Debug)]
pub struct MyTaskService {
    pool: PgPool,
}

#[tonic::async_trait]
impl TaskService for MyTaskService {
    async fn create_project(&self, request: Request<CreateProjectRequest>) -> Result<Response<Project>, Status> {
        let req = request.into_inner();
        let id = Uuid::new_v4();
        let owner_id = Uuid::parse_str(&req.owner_id).map_err(|_| Status::invalid_argument("Invalid Owner UUID"))?;

        sqlx::query("INSERT INTO projects (id, owner_id, name, description, status) VALUES ($1, $2, $3, $4, $5)")
            .bind(id)
            .bind(owner_id)
            .bind(&req.name)
            .bind(&req.description)
            .bind("active")
            .execute(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB: {}", e)))?;

        Ok(Response::new(Project {
            id: id.to_string(),
            owner_id: req.owner_id,
            name: req.name,
            description: req.description,
            status: "active".into(),
        }))
    }

    async fn list_projects(&self, request: Request<ListProjectsRequest>) -> Result<Response<ListProjectsResponse>, Status> {
         let req = request.into_inner();
         let owner_id = Uuid::parse_str(&req.owner_id).map_err(|_| Status::invalid_argument("Invalid Owner UUID"))?;
         
         let rows = sqlx::query("SELECT id, owner_id, name, description, status FROM projects WHERE owner_id = $1 ORDER BY created_at DESC")
            .bind(owner_id)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB: {}", e)))?;
            
         let projects = rows.into_iter().map(|row| Project {
            id: row.get::<Uuid, _>("id").to_string(),
            owner_id: row.get::<Uuid, _>("owner_id").to_string(),
            name: row.get("name"),
            description: row.get("description"),
            status: row.get("status"), 
         }).collect();
         
         Ok(Response::new(ListProjectsResponse { projects }))
    }

    async fn create_task(&self, request: Request<CreateTaskRequest>) -> Result<Response<Task>, Status> {
        let req = request.into_inner();
        let id = Uuid::new_v4();
        let project_id = Uuid::parse_str(&req.project_id).map_err(|_| Status::invalid_argument("Invalid Project UUID"))?;
        let assignee_id = if req.assignee_id.is_empty() { None } else { Some(Uuid::parse_str(&req.assignee_id).unwrap_or(Uuid::nil())) };

        sqlx::query("INSERT INTO tasks (id, project_id, title, description, priority, assignee_id, status) VALUES ($1, $2, $3, $4, $5, $6, 'todo')")
            .bind(id)
            .bind(project_id)
            .bind(&req.title)
            .bind(&req.description)
            .bind(&req.priority)
            .bind(assignee_id)
            .execute(&self.pool)
            .await
            .map_err(|e| Status::internal(format!("DB: {}", e)))?;

        Ok(Response::new(Task {
            id: id.to_string(),
            project_id: req.project_id,
            title: req.title,
            description: req.description,
            status: "todo".into(),
            priority: req.priority,
            assignee_id: req.assignee_id,
            position: 0,
        }))
    }

    async fn list_tasks(&self, request: Request<ListTasksRequest>) -> Result<Response<ListTasksResponse>, Status> {
        let req = request.into_inner();
        let project_id = Uuid::parse_str(&req.project_id).map_err(|_| Status::invalid_argument("Invalid Project UUID"))?;

        let rows = sqlx::query("SELECT id, project_id, title, description, status, priority, assignee_id, position FROM tasks WHERE project_id = $1 ORDER BY position ASC, created_at DESC")
             .bind(project_id)
             .fetch_all(&self.pool)
             .await
             .map_err(|e| Status::internal(format!("DB: {}", e)))?;

        let tasks = rows.into_iter().map(|row| Task {
            id: row.get::<Uuid, _>("id").to_string(),
            project_id: row.get::<Uuid, _>("project_id").to_string(),
            title: row.get("title"),
            description: row.get::<Option<String>, _>("description").unwrap_or_default(),
            status: row.get("status"),
            priority: row.get("priority"),
            assignee_id: row.get::<Option<Uuid>, _>("assignee_id").map(|u| u.to_string()).unwrap_or_default(),
            position: row.get("position"),
        }).collect();

        Ok(Response::new(ListTasksResponse { tasks }))
    }

    async fn update_task(&self, request: Request<UpdateTaskRequest>) -> Result<Response<UpdateTaskResponse>, Status> {
        let req = request.into_inner();
        let id = Uuid::parse_str(&req.id).map_err(|_| Status::invalid_argument("Invalid Task UUID"))?;

        // Simple update logic: if fields are non-empty, update.
        // For status/priority/position
        if !req.status.is_empty() {
            sqlx::query("UPDATE tasks SET status = $1 WHERE id = $2")
                .bind(&req.status)
                .bind(id)
                .execute(&self.pool).await.ok();
        }
        if !req.priority.is_empty() {
             sqlx::query("UPDATE tasks SET priority = $1 WHERE id = $2")
                .bind(&req.priority)
                .bind(id)
                .execute(&self.pool).await.ok();
        }
        if req.position >= 0 {
              sqlx::query("UPDATE tasks SET position = $1 WHERE id = $2")
                .bind(req.position)
                .bind(id)
                .execute(&self.pool).await.ok();
        }

        // Fetch updated
        let row = sqlx::query("SELECT id, project_id, title, description, status, priority, assignee_id, position FROM tasks WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(|_| Status::not_found("Task not found"))?;

        let task = Task {
            id: row.get::<Uuid, _>("id").to_string(),
            project_id: row.get::<Uuid, _>("project_id").to_string(),
            title: row.get("title"),
            description: row.get::<Option<String>, _>("description").unwrap_or_default(),
            status: row.get("status"),
            priority: row.get("priority"),
            assignee_id: row.get::<Option<Uuid>, _>("assignee_id").map(|u| u.to_string()).unwrap_or_default(),
            position: row.get("position"),
        };

        Ok(Response::new(UpdateTaskResponse { task: Some(task) }))
    }

    async fn update_project(&self, request: Request<UpdateProjectRequest>) -> Result<Response<Project>, Status> {
        let req = request.into_inner();
        let id = Uuid::parse_str(&req.id).map_err(|_| Status::invalid_argument("Invalid Project UUID"))?;

        if !req.description.is_empty() {
             sqlx::query("UPDATE projects SET description = $1 WHERE id = $2").bind(&req.description).bind(id).execute(&self.pool).await.ok();
        }
        if req.funding_goal > 0.0 {
             sqlx::query("UPDATE projects SET funding_goal = $1 WHERE id = $2").bind(req.funding_goal).bind(id).execute(&self.pool).await.ok();
        }
        if req.equity_offered >= 0.0 {
             sqlx::query("UPDATE projects SET equity_offered = $1 WHERE id = $2").bind(req.equity_offered).bind(id).execute(&self.pool).await.ok();
        }
        // Always update is_public boolean
        sqlx::query("UPDATE projects SET is_public = $1 WHERE id = $2").bind(req.is_public).bind(id).execute(&self.pool).await.ok();
        
        if !req.industry.is_empty() {
             sqlx::query("UPDATE projects SET industry = $1 WHERE id = $2").bind(&req.industry).bind(id).execute(&self.pool).await.ok();
        }

        let row = sqlx::query("SELECT id, owner_id, name, description, status, funding_goal, equity_offered, is_public, industry FROM projects WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(|_| Status::not_found("Project not found"))?;

        Ok(Response::new(Project {
            id: row.get::<Uuid, _>("id").to_string(),
            owner_id: row.get::<Uuid, _>("owner_id").to_string(),
            name: row.get("name"),
            description: row.get::<Option<String>, _>("description").unwrap_or_default(),
            status: row.get("status"), 
            funding_goal: row.get("funding_goal"),
            equity_offered: row.get("equity_offered"),
            is_public: row.get("is_public"),
            industry: row.get::<Option<String>, _>("industry").unwrap_or_default(),
        }))
    }

    async fn list_public_projects(&self, request: Request<ListPublicProjectsRequest>) -> Result<Response<ListProjectsResponse>, Status> {
         let req = request.into_inner();
         
         // Simple filter for now
         let query = if !req.industry_filter.is_empty() {
             "SELECT id, owner_id, name, description, status, funding_goal, equity_offered, is_public, industry FROM projects WHERE is_public = true AND industry = $1 ORDER BY created_at DESC"
         } else {
             "SELECT id, owner_id, name, description, status, funding_goal, equity_offered, is_public, industry FROM projects WHERE is_public = true ORDER BY created_at DESC"
         };
         
         let q = sqlx::query(query);
         let rows = if !req.industry_filter.is_empty() {
             q.bind(req.industry_filter).fetch_all(&self.pool).await
         } else {
             q.fetch_all(&self.pool).await
         }.map_err(|e| Status::internal(format!("DB: {}", e)))?;

         let projects = rows.into_iter().map(|row| Project {
            id: row.get::<Uuid, _>("id").to_string(),
            owner_id: row.get::<Uuid, _>("owner_id").to_string(),
            name: row.get("name"),
            description: row.get::<Option<String>, _>("description").unwrap_or_default(),
            status: row.get("status"), 
            funding_goal: row.get("funding_goal"),
            equity_offered: row.get("equity_offered"),
            is_public: row.get("is_public"),
            industry: row.get::<Option<String>, _>("industry").unwrap_or_default(),
         }).collect();
         
         Ok(Response::new(ListProjectsResponse { projects }))
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
    let idea_service = MyIdeaService { pool: pool.clone() };
    let task_service = MyTaskService { pool };

    println!("Brain Core Service listening on {}", addr);

    Server::builder()
        .add_service(IdeaServiceServer::new(idea_service))
        .add_service(TaskServiceServer::new(task_service))
        .serve(addr)
        .await?;

    Ok(())
}
