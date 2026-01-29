"use client"

import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function NewIdeaPage() {
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            window.location.href = "/dashboard"
        }, 2000)
    }

    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    New Idea
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">Discard</Link>
                    </Button>
                    <Button size="sm" onClick={onSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish Idea
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Idea Details</CardTitle>
                            <CardDescription>
                                Define the core problem and your proposed solution. Be specific.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        className="w-full"
                                        placeholder="e.g. Netflix for Cats"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="problem">The Problem</Label>
                                    <Textarea
                                        id="problem"
                                        className="min-h-32"
                                        placeholder="Describe the friction or inefficiency you are solving..."
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="solution">Proposed Solution</Label>
                                    <Textarea
                                        id="solution"
                                        className="min-h-32"
                                        placeholder="How does your product solve this? What is the MVP?"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Needs</CardTitle>
                            <CardDescription>
                                Who do you need to build this?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="status">Looking For</Label>
                                    <Select>
                                        <SelectTrigger id="status" aria-label="Select role">
                                            <SelectValue placeholder="Select primary role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="frontend">Frontend Developer</SelectItem>
                                            <SelectItem value="backend">Backend Developer</SelectItem>
                                            <SelectItem value="designer">Product Designer</SelectItem>
                                            <SelectItem value="marketing">Growth/Marketing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        type="text"
                                        className="w-full"
                                        placeholder="e.g. Rust, AI, Social"
                                    />
                                    <p className="text-xs text-muted-foreground">Comma separated</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Mobile Action Button */}
            <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">Discard</Link>
                </Button>
                <Button size="sm" onClick={onSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Publish Idea
                </Button>
            </div>
        </div>
    )
}
