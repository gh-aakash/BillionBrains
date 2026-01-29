"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flag, MoreHorizontal, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTaskAction } from "@/app/actions/project"
import { useRouter } from "next/navigation"

// Define the shape of a Task from the API
type Task = {
    id: string
    title: string
    status: string
    priority: string
    assignee_id?: string
    description?: string
}

type ProjectBoardProps = {
    tasks: Task[]
    projectId: string
}

const PriorityFlag = ({ priority }: { priority: string }) => {
    const colors: Record<string, string> = {
        low: "text-slate-400",
        medium: "text-blue-500",
        high: "text-yellow-500",
        urgent: "text-red-500"
    }
    return <Flag className={`h-4 w-4 ${colors[priority.toLowerCase()] || colors.medium}`} fill="currentColor" />
}

export function ProjectBoard({ tasks, projectId }: ProjectBoardProps) {
    const router = useRouter()
    // Group tasks by status
    const columns = {
        todo: tasks.filter(t => t.status === 'todo'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        done: tasks.filter(t => t.status === 'done')
    }

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        const title = formData.get("title") as string
        const priority = formData.get("priority") as string

        const res = await createTaskAction(projectId, title, priority)
        if (res.success) {
            setOpen(false)
            router.refresh() // Refresh Server Component to fetch new tasks
        }
        setLoading(false)
    }

    return (
        <div className="flex bg-muted/20 p-4 rounded-lg h-[600px] gap-4 overflow-x-auto">
            {Object.entries(columns).map(([status, columnTasks]) => (
                <div key={status} className="w-[300px] flex-shrink-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="uppercase text-xs font-semibold text-muted-foreground tracking-wider">{status.replace('_', ' ')}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {columnTasks.map((task) => (
                            <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="p-3 pb-0 space-y-0">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="mb-2 text-[10px] px-1 py-0">{task.priority}</Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2"><MoreHorizontal className="h-3 w-3" /></Button>
                                    </div>
                                    <CardTitle className="text-sm font-medium leading-tight">{task.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-3 flex items-center justify-between">
                                    <PriorityFlag priority={task.priority} />
                                    {task.assignee_id && (
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px]">US</AvatarFallback>
                                        </Avatar>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* New Task Button / Dialog */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-8 mt-2">
                                <Plus className="mr-2 h-4 w-4" /> New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                            </DialogHeader>
                            <form action={onSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Task Title</Label>
                                    <Input id="title" name="title" placeholder="e.g. Design Homepage" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select name="priority" defaultValue="medium">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Task
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    )
}
