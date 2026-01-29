import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrainCircuit, Star, GitCommit, Trophy } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header Profile Card */}
            <Card>
                <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <div className="flex items-center justify-center gap-2 sm:justify-start">
                            <h1 className="text-2xl font-bold">Aakash Gupta</h1>
                            <Badge variant="secondary" className="gap-1">
                                <Trophy className="h-3 w-3 text-yellow-500" />
                                Top Rated
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Full Stack Engineer • Shanghai, China</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                            <Badge>React</Badge>
                            <Badge>Rust</Badge>
                            <Badge>Kubernetes</Badge>
                            <Badge variant="outline">+4 more</Badge>
                        </div>
                    </div>
                    <div className="grid gap-2 text-center sm:text-right">
                        <div className="flex flex-col items-center rounded-lg border p-3 sm:items-end">
                            <span className="text-xs text-muted-foreground uppercase font-bold">Reputation</span>
                            <span className="text-2xl font-bold text-primary">98.5</span>
                        </div>
                        <Button size="sm" variant="outline">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                        <GitCommit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,284</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ideas Launched</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">1 Active Project</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Endorsements</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14</div>
                        <p className="text-xs text-muted-foreground">Mostly for "System Design"</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="ideas" className="w-full">
                <TabsList>
                    <TabsTrigger value="ideas">My Ideas</TabsTrigger>
                    <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>
                <TabsContent value="ideas" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Launched Ideas</CardTitle>
                            <CardDescription>Projects you have started.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-semibold">Billion Brains</h4>
                                        <p className="text-sm text-muted-foreground">The execution network for builders.</p>
                                    </div>
                                    <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-semibold">DeFi Sniper Bot</h4>
                                        <p className="text-sm text-muted-foreground">Automated trading on Solana.</p>
                                    </div>
                                    <Badge variant="secondary">Draft</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="collaborations" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Contibutions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">No active collaborations yet. Find a project in the Feed!</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
