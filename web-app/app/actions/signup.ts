"use server"

import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.join(process.cwd(), "../shared-libs/proto/src/user.proto")

// Client definition reuse (Should be util in real app)
let client: any = null

function getClient() {
    if (client) return client

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    })

    const userProto = grpc.loadPackageDefinition(packageDefinition).user as any
    const target = process.env.IDENTITY_SERVICE_URL || "svc-identity:50051"

    client = new userProto.UserService(
        target,
        grpc.credentials.createInsecure()
    )
    return client
}

export async function signupAction(formData: FormData) {
    const full_name = formData.get("full_name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const bio = formData.get("bio") as string
    const role = formData.get("role") as string

    if (!email || !password || !full_name) {
        return { error: "Missing required fields" }
    }

    const client = getClient()

    return new Promise((resolve, reject) => {
        client.CreateUser({
            username: email, // Mapping email to username 
            password,
            full_name,
            bio,
            role
        }, (err: any, response: any) => {
            if (err) {
                console.error("gRPC Signup Error:", err)
                resolve({ error: "Registration failed. Email might be taken." })
            } else {
                resolve({ success: true })
            }
        })
    })
}
