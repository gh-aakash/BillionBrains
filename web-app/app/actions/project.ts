"use server"

import { cookies } from "next/headers"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"

const PROTO_PATH = path.join(process.cwd(), "../shared-libs/proto/src/task.proto")

let taskClient: any = null

function getTaskClient() {
    if (taskClient) return taskClient

    try {
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        })

        const taskProto = grpc.loadPackageDefinition(packageDefinition).task as any
        const target = process.env.BRAIN_SERVICE_URL || "svc-brain-core:50052"

        taskClient = new taskProto.TaskService(
            target,
            grpc.credentials.createInsecure()
        )
        return taskClient
    } catch (e) {
        console.error("Failed to load Task Proto or connect:", e)
        return null
    }
}

export async function launchProjectAction(title: string, description: string, industry: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; project?: any }>((resolve) => {
        client.LaunchProject({
            idea_id: "new-idea", // Mock ID
            title,
            description,
            industry
        }, (err: any, response: any) => {
            if (err) {
                console.error("LaunchProject Error:", err)
                resolve({ error: "AI Launch failed" })
            } else {
                resolve({ success: true, project: response })
            }
        })
    })
}

export async function createProjectAction(name: string, description: string, owner_id: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; project?: any }>((resolve) => {
        client.CreateProject({ name, description, owner_id }, (err: any, response: any) => {
            if (err) {
                console.error("CreateProject Error:", err)
                resolve({ error: err.details || "Failed to create project" })
            } else {
                resolve({ success: true, project: response })
            }
        })
    })
}

export async function listProjectsAction(owner_id: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; projects?: any[] }>((resolve) => {
        client.ListProjects({ owner_id }, (err: any, response: any) => {
            if (err) {
                console.error("ListProjects Error:", err)
                resolve({ error: "Failed to fetch projects" })
            } else {
                resolve({ success: true, projects: response.projects || [] })
            }
        })
    })
}

export async function listPublicProjectsAction(industry_filter?: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; projects?: any[] }>((resolve) => {
        client.ListPublicProjects({ industry_filter: industry_filter || "" }, (err: any, response: any) => {
            if (err) {
                console.error("ListPublicProjects Error:", err)
                resolve({ error: "Failed to fetch public projects" })
            } else {
                resolve({ success: true, projects: response.projects || [] })
            }
        })
    })
}

export async function updateProjectAction(id: string, data: { description?: string, funding_goal?: number, equity_offered?: number, is_public?: boolean, industry?: string }) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    const payload = {
        id,
        description: data.description || "",
        funding_goal: data.funding_goal || 0,
        equity_offered: data.equity_offered || 0,
        is_public: data.is_public ?? false,
        industry: data.industry || ""
    }

    return new Promise<{ success?: boolean; error?: string; project?: any }>((resolve) => {
        client.UpdateProject(payload, (err: any, response: any) => {
            if (err) {
                console.error("UpdateProject Error:", err)
                resolve({ error: err.details || "Failed to update project" })
            } else {
                resolve({ success: true, project: response })
            }
        })
    })
}

export async function createTaskAction(project_id: string, title: string, priority: string, assignee_id?: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; task?: any }>((resolve) => {
        client.CreateTask({ project_id, title, priority, assignee_id: assignee_id || "" }, (err: any, response: any) => {
            if (err) {
                console.error("CreateTask Error:", err)
                resolve({ error: err.details || "Failed to create task" })
            } else {
                resolve({ success: true, task: response })
            }
        })
    })
}

export async function listTasksAction(project_id: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; tasks?: any[] }>((resolve) => {
        client.ListTasks({ project_id }, (err: any, response: any) => {
            if (err) {
                console.error("ListTasks Error:", err)
                resolve({ error: "Failed to fetch tasks" })
            } else {
                resolve({ success: true, tasks: response.tasks || [] })
            }
        })
    })
}

export async function updateTaskAction(id: string, status?: string, priority?: string, position?: number) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; task?: any }>((resolve) => {
        client.UpdateTask({ id, status: status || "", priority: priority || "", position: position ?? -1 }, (err: any, response: any) => {
            if (err) {
                console.error("UpdateTask Error:", err)
                resolve({ error: "Failed to update task" })
            } else {
                resolve({ success: true, task: response.task })
            }
        })
    })
}

export async function listNotificationsAction(user_id: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    return new Promise<{ success?: boolean; error?: string; notifications?: any[] }>((resolve) => {
        client.ListNotifications({ user_id }, (err: any, response: any) => {
            if (err) {
                console.error("ListNotifications Error:", err)
                resolve({ error: "Failed to fetch notifications" })
            } else {
                resolve({ success: true, notifications: response.notifications || [] })
            }
        })
    })
}

export async function expressInterestAction(project_id: string, owner_id: string, project_name: string) {
    const client = getTaskClient()
    if (!client) return { error: "Service unavailable" }

    // In a real app, we get Current User (Investor) from Session.
    // For Demo: We use a Mock Investor ID.
    const investor_id = "investor-uuid-demo"

    return new Promise<{ success?: boolean; error?: string }>((resolve) => {
        const content = `New Investment Interest in ${project_name}!`
        const payload = JSON.stringify({ project_id, investor_id })

        client.CreateNotification({
            user_id: owner_id,
            type_pb: "investment_interest", // Proto field is `type`, Rust is `r#type`?
            // Actually, generated JS/TS code uses `type`. The Rust issue was internal.
            // Wait, proto field is `type`.
            type: "investment_interest",
            content,
            payload_json: payload
        }, (err: any, response: any) => {
            if (err) {
                console.error("CreateNotification Error:", err)
                resolve({ error: "Failed to send interest" })
            } else {
                resolve({ success: true })
            }
        })
    })
}
