"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { listPublicProjectsAction, expressInterestAction } from "@/app/actions/project"
import { DollarSign, PieChart, TrendingUp, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast" // Removed missing module
// I don't recall creating toast. I will use simple alert or button state change for now.
// Actually, I'll create a simple "Success" state in the modal.

export default function InvestorDashboardPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState<any>(null)

    useEffect(() => {
        listPublicProjectsAction().then(res => {
            if (res.success) setProjects(res.projects || [])
            setLoading(false)
        })
    }, [])

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Investor Discovery</h2>
                    <p className="text-muted-foreground">Find the next unicorn on Billion Brains.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search industries (AI, Crypto...)" className="pl-9" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[200px]"><Loader2 className="animate-spin" /></div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-muted/10">
                    <TrendingUp className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Active Deals</h3>
                    <p className="text-muted-foreground">Check back later or adjust your filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: any) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-primary cursor-pointer" onClick={() => setSelectedProject(project)}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle>{project.name}</CardTitle>
                                        <Badge variant="outline">{project.industry || "General"}</Badge>
                                    </div>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>F</AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {project.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Goal</span>
                                        <span className="font-bold text-lg flex items-center">
                                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                            {project.funding_goal?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Equity</span>
                                        <span className="font-bold text-lg flex items-center">
                                            <PieChart className="h-4 w-4 text-blue-600 mr-1" />
                                            {project.equity_offered}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">View Deal Room</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Deal Room Modal */}
            <DealRoomDialog project={selectedProject} open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)} />
        </div>
    )
}

function DealRoomDialog({ project, open, onOpenChange }: { project: any, open: boolean, onOpenChange: (open: boolean) => void }) {
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    if (!project) return null

    async function handleInvest() {
        setSending(true)
        await expressInterestAction(project.id, project.owner_id, project.name)
        setSending(false)
        setSent(true)
        setTimeout(() => {
            setSent(false)
            onOpenChange(false)
        }, 2000)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl">{project.name}</DialogTitle>
                            <DialogDescription className="text-base mt-2">{project.industry} • Series A</DialogDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-green-600 flex items-center justify-end"><DollarSign className="h-4 w-4" /> {project.funding_goal?.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Target</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <Label className="mb-2 block font-bold">Executive Summary</Label>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {project.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border p-4 rounded-lg text-center">
                            <div className="text-xs uppercase text-muted-foreground mb-1">Equity Offered</div>
                            <div className="text-2xl font-bold">{project.equity_offered}%</div>
                        </div>
                        <div className="border p-4 rounded-lg text-center">
                            <div className="text-xs uppercase text-muted-foreground mb-1">Implied Valuation</div>
                            <div className="text-2xl font-bold">
                                ${(project.funding_goal / (project.equity_offered / 100)).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Message to Founder</Label>
                        <Textarea placeholder="Hi, I'm interested in leading this round..." className="h-[100px]" />
                    </div>
                </div>

                <DialogFooter>
                    {sent ? (
                        <Button className="w-full bg-green-600 hover:bg-green-700">✓ Interest Sent</Button>
                    ) : (
                        <Button className="w-full" size="lg" onClick={handleInvest} disabled={sending}>
                            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Commit Capital / Contact"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
