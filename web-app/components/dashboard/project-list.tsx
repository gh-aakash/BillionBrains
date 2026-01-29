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

const tasks = [
    { id: "1", title: "Research Competitors", tag: "Strategy", priority: "high", assignee: "AC", status: "To Do" },
    { id: "2", title: "Draft Whitepaper", tag: "Content", priority: "medium", assignee: "JD", status: "To Do" },
    { id: "3", title: "Develop MVP Protocol", tag: "Engineering", priority: "urgent", assignee: "AC", status: "In Progress" },
    { id: "4", title: "Setup Legal Entity", tag: "Legal", priority: "low", assignee: "JD", status: "Done" },
    { id: "5", title: "Brand Identity", tag: "Design", priority: "medium", assignee: "AC", status: "Done" },
]

export function ProjectList() {
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
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{task.title}</span>
                                    <span className="text-xs text-muted-foreground">{task.tag}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <div className={`h-2 w-2 rounded-full mr-2 ${task.status === 'Done' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                    {task.status}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Flag className={`h-4 w-4 ${task.priority === 'urgent' ? 'text-red-500' :
                                        task.priority === 'high' ? 'text-yellow-500' :
                                            task.priority === 'medium' ? 'text-blue-500' : 'text-slate-400'
                                    }`} fill="currentColor" />
                            </TableCell>
                            <TableCell>
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
