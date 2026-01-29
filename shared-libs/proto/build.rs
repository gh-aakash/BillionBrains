fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .compile(
            &["src/user.proto", "src/idea.proto", "src/team.proto", "src/task.proto"],
            &["src"],
        )?;
    Ok(())
}
