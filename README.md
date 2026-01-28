# Billion Brains

A collaboration-first digital platform designed to unite ideas, skilled minds, and execution.

## 🚀 Architecture (2026 Standards)
*   **Orchestration**: Kubernetes (Kind) + Cilium (eBPF)
*   **Backend**: Rust Microservices (Axum + Tonic gRPC)
*   **Communication**: gRPC + NATS JetStream
*   **Data**: PostgreSQL + Redis
*   **Frontend**: Next.js 15+ (Planned)

## 🛠️ Prerequisites
1.  **Docker Desktop**: Must be running.
2.  **Rust**: `cargo` must be in PATH.
3.  **Kubernetes Tools**: `kind`, `kubectl`, `helm`.
4.  **C++ Build Tools**: Required for compiling Rust on Windows.

## 🏃‍♂️ Quick Start

### 1. Initialize Infrastructure
```powershell
# Create local cluster
kind create cluster --config k8s/kind-config.yaml --name billion-brains

# Apply Storage/Infrastructure
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/nats.yaml
```

### 2. Build Services
```powershell
# Compile all microservices
cargo build
```

### 3. Run Services (Dev Mode)
*   Identity Service: `cargo run --bin svc-identity`
*   Brain Core: `cargo run --bin svc-brain-core`
*   Gateway: `cargo run --bin svc-gateway`
```
# BillionBrains
