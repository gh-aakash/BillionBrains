import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, DollarSign, Rocket, Users, Layout, List, FolderPlus } from "lucide-react"
import { ProjectBoard } from "@/components/dashboard/project-board"
import { ProjectList } from "@/components/dashboard/project-list"
import { ProjectDocs } from "@/components/dashboard/project-docs"
import { listProjectsAction, listTasksAction, createProjectAction } from "@/app/actions/project"
import { redirect } from "next/navigation"

// Mock Session User ID (In real app, get from Cookie/JWT)
// This must match a user in DB. Ideally we pass it or get it.
// For now, let's assume the user needs to enter it? OR we fetch "All" projects?
// listProjectsAction takes 'owner_id'. 
// We will use a "Demo" UUID or try to use the one from Signup if we stored it?
// We stored token. Token has Email. We don't have ID easily.
// FIX: We will just Create a Project if none exist, and store ID in URL?
// Better: Just show "Demo Project" if fail? No, user wants REAL.

export default async function CreatorDashboardPage({ searchParams }: { searchParams: { projectId?: string } }) {
    // Hardcoding a known UUID or using a "Global" search for MVP since we lack full session context in this Server Component specific snippet
    // In a full implementation, we decode JWT.
    // For the immediate "See it work" effect, we'll try to fetch ANY project or let user create one.
    const DEMO_OWNER_ID = "00000000-0000-0000-0000-000000000000" // Requires DB to have this? No.
    // Actually, let's just create a project if needed.

    // Logic: Fetch Projects for "Current User".
    // Since we can't easily get ID here without decoding JWT (which needs secret), we might hit a wall on "Who am I?".
    // Workaround: We will rely on the User Creating a Project first.

    // Let's TRY to fetch projects.
    // We need to know who we are. 
    // Let's assume the client passes ID? No secure.

    // Okay, for this "God Level" demo, we'll use a placeholder behavior:
    // "Create Your First Project" -> Input Name -> Submit -> Calls Action -> Redirects with ?projectId=...

    let projects: any[] = []
    let tasks: any[] = []

    // Use a hacky "Public" fetch or rely on user creation return
    // If ?projectId is present, fetch that project's tasks
    const projectId = searchParams?.projectId

    if (projectId) {
        const taskRes = await listTasksAction(projectId)
        if (taskRes.success) {
            tasks = taskRes.tasks || []
        }
    }

    // Action to create project
    async function createProject(formData: FormData) {
        "use server"
        const name = formData.get("name") as string
        // Create with a generated UUID for owner since we don't have it
        // In production, extract from Session
        const owner_id = "123e4567-e89b-12d3-a456-426614174000" // Valid UUID format
        const res = await createProjectAction(name, "New Project", owner_id)
        if (res.success && res.project) {
            redirect(`/dashboard/creator?projectId=${res.project.id}`)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Creator Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {!projectId && (
                        <form action={createProject} className="flex gap-2">
                            <Input name="name" placeholder="New Project Name" className="w-[200px]" required />
                            <Button type="submit"><FolderPlus className="mr-2 h-4 w-4" /> Create</Button>
                        </form>
                    )}
                    {projectId && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Project Active</span>
                            <Button variant="outline" size="sm">Settings</Button>
                        </div>
                    )}
                </div>
            </div>

            {!projectId ? (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
                    <h3 className="text-2xl font-semibold mb-2">No Active Project</h3>
                    <p className="text-muted-foreground mb-4">Create a project above to start managing tasks.</p>
                </div>
            ) : (
                <Tabs defaultValue="projects" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="projects">Tasks (Real)</TabsTrigger>
                        <TabsTrigger value="docs">Docs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card>
                            <CardHeader><CardTitle>Project Stats</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(tasks || []).length} Tasks</div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4">
                        <Tabs defaultValue="board">
                            <div className="flex items-center justify-between mb-4">
                                <TabsList>
                                    <TabsTrigger value="board"><Layout className="mr-2 h-4 w-4" /> Board</TabsTrigger>
                                    <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="board" className="mt-0">
                                <ProjectBoard tasks={tasks} />
                            </TabsContent>
                            <TabsContent value="list" className="mt-0">
                                <ProjectList />
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="docs" className="space-y-4">
                        <ProjectDocs />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
