# Builder Stage
FROM rust:1.81 as builder
WORKDIR /app
COPY . .
# Build the specific service
RUN cargo build --release --locked -p svc-identity

# Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/svc-identity /app/svc-identity
CMD ["./svc-identity"]
