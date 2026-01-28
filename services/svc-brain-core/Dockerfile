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
RUN cargo build --release -p svc-brain-core

# Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/svc-brain-core /app/svc-brain-core
CMD ["./svc-brain-core"]
