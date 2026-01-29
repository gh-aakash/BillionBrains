"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, DollarSign, Rocket, Users, Layout, List } from "lucide-react"
import { ProjectBoard } from "@/components/dashboard/project-board"
import { ProjectList } from "@/components/dashboard/project-list"

export default function CreatorDashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Creator Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Invite Team</Button>
                    <Button>New Project</Button>
                </div>
            </div>
            <Tabs defaultValue="projects" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="projects">Projects & Tasks</TabsTrigger>
                    <TabsTrigger value="docs" disabled>Docs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                                <Rocket className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12</div>
                                <p className="text-xs text-muted-foreground">3 launching soon</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">98.2</div>
                                <p className="text-xs text-muted-foreground">Top 1% of creators</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">+201 since last hour</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <Tabs defaultValue="board">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList>
                                <TabsTrigger value="board"><Layout className="mr-2 h-4 w-4" /> Board</TabsTrigger>
                                <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
                            </TabsList>
                            <div className="flex gap-2">
                                <span className="text-sm text-muted-foreground self-center mr-2">Group by: Status</span>
                            </div>
                        </div>
                        <TabsContent value="board" className="mt-0">
                            <ProjectBoard />
                        </TabsContent>
                        <TabsContent value="list" className="mt-0">
                            <ProjectList />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    )
}
