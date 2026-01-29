import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { listPublicProjectsAction } from "@/app/actions/project"
import { DollarSign, PieChart, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function InvestorDashboardPage() {
    const res = await listPublicProjectsAction()
    const projects = res.success ? (res.projects || []) : []

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

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-muted/10">
                    <TrendingUp className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Active Deals</h3>
                    <p className="text-muted-foreground">Check back later or adjust your filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: any) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
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
        </div>
    )
}
