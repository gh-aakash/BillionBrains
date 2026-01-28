use serde::Deserialize;
use dotenvy::dotenv;
use std::env;

#[derive(Deserialize, Debug)]
pub struct Config {
    pub database_url: String,
    pub server_addr: String,
}

impl Config {
    pub fn from_env() -> Result<Self, config::ConfigError> {
        dotenv().ok();
        
        let database_url = env::var("DATABASE_URL").map_err(|_| config::ConfigError::Message("DATABASE_URL must be set".into()))?;
        let server_addr = env::var("SERVER_ADDR").unwrap_or_else(|_| "0.0.0.0:50052".to_string());
        
        Ok(Config {
            database_url,
            server_addr,
        })
    }
}
