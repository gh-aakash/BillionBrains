"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flag, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export function ProjectBoard({ tasks }: ProjectBoardProps) {
    // Group tasks by status
    const columns = {
        todo: tasks.filter(t => t.status === 'todo'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        done: tasks.filter(t => t.status === 'done')
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
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-8 mt-2">
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
            ))}
        </div>
    )
}
