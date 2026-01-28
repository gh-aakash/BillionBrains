# Builder Stage
FROM rustlang/rust:nightly AS builder
WORKDIR /app
COPY . .
RUN cargo build --release -p svc-gateway

# Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/svc-gateway /app/svc-gateway
CMD ["./svc-gateway"]
