"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flag, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

type Task = {
    id: string
    title: string
    status: string
    priority: string
    assignee_id?: string
    description?: string
}

type ProjectListProps = {
    tasks: Task[]
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'urgent': return 'text-red-500'
        case 'high': return 'text-yellow-500'
        case 'medium': return 'text-blue-500'
        default: return 'text-slate-400'
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'done': return 'bg-green-500'
        case 'in_progress': return 'bg-blue-500'
        default: return 'bg-slate-300'
    }
}

export function ProjectList({ tasks }: ProjectListProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[400px]">Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No tasks found in this project.
                            </TableCell>
                        </TableRow>
                    ) : (
                        tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{task.title}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{task.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center capitalize">
                                        <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(task.status)}`} />
                                        {task.status.replace('_', ' ')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} fill="currentColor" />
                                </TableCell>
                                <TableCell>
                                    {task.assignee_id ? (
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px]">US</AvatarFallback>
                                        </Avatar>
                                    ) : <span className="text-muted-foreground text-xs">-</span>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
