"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flag, MoreHorizontal, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTaskAction, updateTaskAction } from "@/app/actions/project"
import { useRouter } from "next/navigation"
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    closestCorners,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Types
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

// Helper Components
const PriorityFlag = ({ priority }: { priority: string }) => {
    const colors: Record<string, string> = {
        low: "text-slate-400",
        medium: "text-blue-500",
        high: "text-yellow-500",
        urgent: "text-red-500"
    }
    return <Flag className={`h-4 w-4 ${colors[priority.toLowerCase()] || colors.medium}`} fill="currentColor" />
}

// Sortable Item Component
function TaskCard({ task, isOverlay }: { task: Task, isOverlay?: boolean }) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: { type: "Task", task }
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    // If overlay, render plain card. If sorting, render standard.
    if (isOverlay) {
        return (
            <Card className="cursor-grabbing shadow-lg border-primary/50 bg-background rotate-2">
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
        )
    }

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="h-[100px] bg-muted/50 border-2 border-dashed border-primary/30 rounded-lg opacity-50" />
        )
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing hover:border-primary/50">
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
        </div>
    )
}

// Droppable Column
function KanbanColumn({ id, title, tasks, children }: { id: string, title: string, tasks: Task[], children: React.ReactNode }) {
    const { setNodeRef } = useSortable({ id: id, data: { type: "Column", id } })
    return (
        <div ref={setNodeRef} className="w-[300px] flex-shrink-0 flex flex-col gap-3 min-h-[500px]">
            <div className="flex items-center justify-between px-2 cursor-default">
                <span className="uppercase text-xs font-semibold text-muted-foreground tracking-wider">{title}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            <div className="flex flex-col gap-3 flex-1 p-1">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {children}
                </SortableContext>
            </div>
        </div>
    )
}

export function ProjectBoard({ tasks: initialTasks, projectId }: ProjectBoardProps) {
    const router = useRouter()
    // Local state for DnD
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    // Sync props (if server refresh happens)
    useEffect(() => {
        setTasks(initialTasks)
    }, [initialTasks])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // 5px drag to start
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    // Memoize columns for rendering
    const columns = useMemo(() => {
        return {
            todo: tasks.filter(t => t.status === "todo"),
            in_progress: tasks.filter(t => t.status === "in_progress"),
            done: tasks.filter(t => t.status === "done")
        }
    }, [tasks])

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task)
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        // Find containers
        const isActiveTask = active.data.current?.type === "Task"
        const isOverTask = over.data.current?.type === "Task"
        const isOverColumn = over.data.current?.type === "Column"

        if (!isActiveTask) return

        // Find the task in state
        const activeTask = tasks.find(t => t.id === activeId)
        const overTask = tasks.find(t => t.id === overId)

        if (!activeTask) return

        // Moving between columns logic (during drag) is complex with Sortable.
        // For simple MVP: We only care about Drop.
        // But visuals need to look right.

        // Dnd-kit handles list sorting visually if items match.
        // If Moving to a different column (over a task in diff column)
        if (isOverTask && overTask && activeTask.status !== overTask.status) {
            setTasks(items => {
                const activeIndex = items.findIndex(t => t.id === activeId)
                const overIndex = items.findIndex(t => t.id === overId)

                // Create new array
                const newItems = [...items]
                // Optimistically update status
                newItems[activeIndex].status = overTask.status
                // Move
                return arrayMove(newItems, activeIndex, overIndex)
            })
        }

        // If moving over an empty column
        if (isOverColumn) {
            const activeIndex = tasks.findIndex(t => t.id === activeId)
            if (tasks[activeIndex].status !== overId) {
                setTasks(items => {
                    const newItems = [...items]
                    newItems[activeIndex].status = String(overId)
                    return newItems
                })
            }
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveTask(null)

        if (!over) return

        const activeId = active.id as string
        // determine new status
        // If over Type is Column (empty column drop)
        let newStatus = ""

        if (over.data.current?.type === "Column") {
            newStatus = over.id as string
        } else if (over.data.current?.type === "Task") {
            const overTask = tasks.find(t => t.id === over.id)
            if (overTask) newStatus = overTask.status
        }

        if (newStatus) {
            // Find task
            const task = tasks.find(t => t.id === activeId)
            if (task && task.status !== newStatus) {
                // Confirm Update to Server
                updateTaskAction(activeId, newStatus)
                // Local state already updated in DragOver, but ensure consistency
            } else if (task && over.data.current?.type === "Task") {
                // Same column reorder - we don't persist order yet server side but let's keep local
                // handled by dragOver arrayMove
            }
        }

        // Final full sync from server if needed?
        // router.refresh() // Maybe too aggressive.
    }

    // --- Task Creation Logic ---
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    async function onSubmit(formData: FormData) {
        setLoading(true)
        const title = formData.get("title") as string
        const priority = formData.get("priority") as string
        const res = await createTaskAction(projectId, title, priority)
        if (res.success) {
            setOpen(false)
            router.refresh()
        }
        setLoading(false)
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex bg-muted/20 p-4 rounded-lg h-[600px] gap-4 overflow-x-auto touch-pan-x">
                {(["todo", "in_progress", "done"] as const).map((colId) => (
                    <KanbanColumn key={colId} id={colId} title={colId.replace('_', ' ')} tasks={columns[colId]}>
                        {columns[colId].map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}

                        {/* Show Add Button at bottom of Todo only? Or all? All. */}
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground text-sm h-8 mt-2"
                            onClick={() => setOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </KanbanColumn>
                ))}
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
                    <form action={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input id="title" name="title" placeholder="e.g. Design Homepage" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select name="priority" defaultValue="medium">
                                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Task</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </DndContext>
    )
}
