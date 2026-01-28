# Builder Stage
FROM rust:1.83 as builder
WORKDIR /app
COPY . .
RUN cargo build --release --locked -p svc-brain-core

# Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/svc-brain-core /app/svc-brain-core
CMD ["./svc-brain-core"]
