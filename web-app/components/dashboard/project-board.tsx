"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flag, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type Task = {
    id: string
    title: string
    tag: string
    priority: "low" | "medium" | "high" | "urgent"
    assignee: string
}

const mockTasks: Record<string, Task[]> = {
    todo: [
        { id: "1", title: "Research Competitors", tag: "Strategy", priority: "high", assignee: "AC" },
        { id: "2", title: "Draft Whitepaper", tag: "Content", priority: "medium", assignee: "JD" },
    ],
    in_progress: [
        { id: "3", title: "Develop MVP Protocol", tag: "Engineering", priority: "urgent", assignee: "AC" },
    ],
    done: [
        { id: "4", title: "Setup Legal Entity", tag: "Legal", priority: "low", assignee: "JD" },
        { id: "5", title: "Brand Identity", tag: "Design", priority: "medium", assignee: "AC" },
    ]
}

const PriorityFlag = ({ priority }: { priority: Task['priority'] }) => {
    const colors = {
        low: "text-slate-400",
        medium: "text-blue-500",
        high: "text-yellow-500",
        urgent: "text-red-500"
    }
    return <Flag className={`h-4 w-4 ${colors[priority]}`} fill="currentColor" />
}

export function ProjectBoard() {
    return (
        <div className="flex bg-muted/20 p-4 rounded-lg h-[600px] gap-4 overflow-x-auto">
            {Object.entries(mockTasks).map(([status, tasks]) => (
                <div key={status} className="w-[300px] flex-shrink-0 flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2">
                        <span className="uppercase text-xs font-semibold text-muted-foreground tracking-wider">{status.replace('_', ' ')}</span>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {tasks.map((task) => (
                            <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardHeader className="p-3 pb-0 space-y-0">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="mb-2 text-[10px] px-1 py-0">{task.tag}</Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2"><MoreHorizontal className="h-3 w-3" /></Button>
                                    </div>
                                    <CardTitle className="text-sm font-medium leading-none">{task.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-3 flex items-center justify-between">
                                    <PriorityFlag priority={task.priority} />
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
                                    </Avatar>
                                </CardContent>
                            </Card>
                        ))}
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-8">
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </div>
                </div>
            ))}
            <div className="w-[300px] flex-shrink-0 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                <Button variant="ghost"><Plus className="mr-2 h-4 w-4" /> Add Status</Button>
            </div>
        </div>
    )
}
