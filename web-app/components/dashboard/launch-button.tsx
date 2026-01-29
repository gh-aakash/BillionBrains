"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { LaunchWizard } from "@/components/dashboard/launch-wizard"

export function LaunchButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button size="sm" className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 border-0" onClick={() => setOpen(true)}>
                <Sparkles className="h-4 w-4" />
                AI Launchpad
            </Button>
            <LaunchWizard open={open} onOpenChange={setOpen} />
        </>
    )
}
