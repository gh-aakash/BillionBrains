"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch" // Need to check if Switch exists? Assuming I might need to create it.
import { Loader2, DollarSign, PieChart, Globe, Lock } from "lucide-react"
import { updateProjectAction } from "@/app/actions/project"
import { useRouter } from "next/navigation"

// Assuming Switch is not installed, I'll use a checkbox or install it. 
// I'll stick to a simple checkbox for MVP to avoid missing dependency loop, or check later.
// Actually, I can use a Button Toggle.

type ProjectSettingsProps = {
    project: any // Type this better
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isPublic, setIsPublic] = useState(project.is_public || false)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        const description = formData.get("description") as string
        const industry = formData.get("industry") as string
        const funding_goal = parseFloat(formData.get("funding_goal") as string) || 0
        const equity_offered = parseFloat(formData.get("equity_offered") as string) || 0

        // isPublic state is handled outside form data slightly (or hidden input)
        // I will just use the state.

        await updateProjectAction(project.id, {
            description,
            industry,
            funding_goal,
            equity_offered,
            is_public: isPublic
        })

        setLoading(false)
        router.refresh()
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Tell investors what you are building.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea name="description" defaultValue={project.description} placeholder="Pitch your project..." className="min-h-[100px]" />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Input name="industry" defaultValue={project.industry} placeholder="e.g. Fintech, AI, BioTech" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Funding Goal ($)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input name="funding_goal" type="number" defaultValue={project.funding_goal} className="pl-9" placeholder="100000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Equity Offer (%)</Label>
                                <div className="relative">
                                    <PieChart className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input name="equity_offered" type="number" step="0.1" defaultValue={project.equity_offered} className="pl-9" placeholder="5.0" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Public Visibility</Label>
                                <div className="text-sm text-muted-foreground">
                                    {isPublic ? "Visible to Investors" : "Private Draft"}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant={isPublic ? "default" : "outline"}
                                onClick={() => setIsPublic(!isPublic)}
                            >
                                {isPublic ? <Globe className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                                {isPublic ? "Public" : "Private"}
                            </Button>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="md:col-span-1 bg-muted/20 border-dashed">
                <CardHeader>
                    <CardTitle>Investor Preview</CardTitle>
                    <CardDescription>This is how your card looks in the Discovery Feed.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[300px]">
                    {/* Preview Card Mockup */}
                    <div className="w-[300px] border bg-background rounded-lg shadow-sm p-4 space-y-3 opacity-90">
                        <div className="flex justify-between items-start">
                            <div className="font-bold text-lg">{project.name || "Project Name"}</div>
                            <Badge variant="secondary">{project.industry || "Industry"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {project.description || "Project description goes here..."}
                        </p>
                        <div className="flex justify-between items-center text-sm font-medium pt-2">
                            <div className="flex items-center text-green-600"><DollarSign className="h-3 w-3 mr-1" /> ${project.funding_goal?.toLocaleString()} Goal</div>
                            <div className="flex items-center text-blue-600"><PieChart className="h-3 w-3 mr-1" /> {project.equity_offered}% Equity</div>
                        </div>
                        <Button className="w-full mt-2" size="sm">Invest Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Badge({ children, variant }: any) {
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>{children}</span>
}
