"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function ProjectDocs() {
    return (
        <div className="flex flex-col gap-4 h-[600px]">
            <Card className="flex-1 flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b pb-4">
                        <Input
                            className="text-3xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            placeholder="Untitled Document"
                            defaultValue="Project Requirements (v1)"
                        />
                        <Button size="sm"><Save className="mr-2 h-4 w-4" /> Save</Button>
                    </div>
                    <Textarea
                        className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 p-0 text-lg leading-relaxed"
                        placeholder="Type your content here..."
                        defaultValue="1. Executive Summary&#10;The objective of this project is to revolutionize the way creators connects with investors...&#10;&#10;2. Scope&#10;- Frontend V2&#10;- Backend Identity Service&#10;- Real-time Notifications"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
