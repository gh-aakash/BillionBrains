# Builder Stage
FROM rust:1.81 as builder
WORKDIR /app
COPY . .
RUN cargo build --release --locked -p svc-gateway

# Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/svc-gateway /app/svc-gateway
CMD ["./svc-gateway"]
