"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { listNotificationsAction } from "@/app/actions/project"
import { useEffect, useState } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Demo User ID (Creator)
const DEMO_USER_ID = "123e4567-e89b-12d3-a456-426614174000"

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [open, setOpen] = useState(false)

    async function fetch() {
        const res = await listNotificationsAction(DEMO_USER_ID)
        if (res.success) {
            setNotifications(res.notifications || [])
        }
    }

    useEffect(() => {
        fetch()
        const interval = setInterval(fetch, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length
    // For demo, we assume all are unread or we just show count. 
    // Since read status isn't updated in backend yet (no MarkRead RPC), we'll just show total count for effect
    // or assume "unread" if created recently. 
    // Let's just show count of new ones.

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-semibold leading-none">Notifications</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{getNotificationTitle(n.type)}</p>
                                        <p className="text-sm text-muted-foreground">{n.content}</p>
                                        <p className="text-xs text-muted-foreground text-[10px]">{new Date(n.created_at).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

function getNotificationTitle(type: string) {
    if (type === 'investment_interest') return "New Investment Interest"
    if (type === 'task_assigned') return "Task Assigned"
    return "Notification"
}
