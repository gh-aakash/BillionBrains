# Builder Stage
FROM rustlang/rust:nightly AS builder

# Install system dependencies for Protocol Buffers
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
# Build the specific service
RUN cargo build --release -p svc-identity

# Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/svc-identity /app/svc-identity
CMD ["./svc-identity"]
