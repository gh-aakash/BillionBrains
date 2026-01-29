"use server"

import { cookies } from "next/headers"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.join(process.cwd(), "../shared-libs/proto/src/user.proto")

// Client definition reuse
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

export async function signupAction(formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const full_name = formData.get("full_name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const bio = formData.get("bio") as string
    const role = formData.get("role") as string

    console.log("Signup Request:", { email, role })

    if (!email || !password || !full_name) {
        return { error: "Missing required fields" }
    }

    const client = getClient()

    return new Promise<{ error?: string; success?: boolean }>((resolve, reject) => {
        // 1. Create User
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
                console.log("User Created:", response)

                // 2. Auto-Login
                client.Login({ email, password }, async (loginErr: any, loginResponse: any) => {
                    if (loginErr) {
                        console.error("Auto-Login Error:", loginErr)
                        // Return success anyway, user can try manual login (at least account exists)
                        resolve({ success: true })
                    } else if (loginResponse && loginResponse.token) {
                        // Set Cookie
                        const cookieStore = await cookies()
                        cookieStore.set("token", loginResponse.token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            path: "/",
                            maxAge: 60 * 60, // 1 hour
                        })
                        resolve({ success: true })
                    } else {
                        resolve({ success: true })
                    }
                })
            }
        })
    })
}
