"use server"

import { cookies } from "next/headers"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.join(process.cwd(), "../shared-libs/proto/src/user.proto")

// Client definition
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

    // Use insecure creds for internal cluster traffic
    client = new userProto.UserService(
        target,
        grpc.credentials.createInsecure()
    )
    return client
}

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    const client = getClient()

    return new Promise((resolve, reject) => {
        client.Login({ email, password }, async (err: any, response: any) => {
            if (err) {
                console.error("gRPC Login Error:", err)
                resolve({ error: "Invalid credentials or service unavailable" })
                return
            }

            // Check if token exists
            if (response && response.token) {
                // Set Cookie
                const cookieStore = await cookies()
                cookieStore.set("token", response.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    maxAge: 60 * 60, // 1 hour
                })

                resolve({ success: true })
            } else {
                resolve({ error: "Login failed" })
            }
        })
    })
}
