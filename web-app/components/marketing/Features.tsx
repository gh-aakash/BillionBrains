import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Users, Rocket, GitBranch, ShieldCheck, Zap } from "lucide-react"

const features = [
    {
        title: "Global Idea Feed",
        description: "Don't hide your genius. Post ideas to a network of verified builders looking for their next challenge.",
        icon: BrainCircuit,
        className: "md:col-span-2", // Bento: Wide card
    },
    {
        title: "Team Assembly",
        description: "Find the missing piece. Match with Developers, Designers, and Marketers who crave equity over hourly rates.",
        icon: Users,
        className: "md:col-span-1",
    },
    {
        title: "Execution > Pitch Decks",
        description: "Investors don't need another slide. They need proof. We track commits, milestones, and shipping velocity.",
        icon: Rocket,
        className: "md:col-span-1",
    },
    {
        title: "Antigravity Scaffolding",
        description: "One-click repo generation. Get a full-stack SaaS boilerplate deployed in minutes, not weeks.",
        icon: Zap,
        className: "md:col-span-2", // Bento: Wide card
    },
]

export function Features() {
    return (
        <section className="container mx-auto px-4 py-24 md:px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Everything You Need to <br />
                    <span className="text-primary">Go From Zero to One.</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                    A complete ecosystem designed to remove friction between "I have an idea" and "We just shipped".
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {features.map((feature, i) => (
                    <Card key={i} className={`bg-secondary/20 border-border/50 backdrop-blur-sm transition-all hover:bg-secondary/40 ${feature.className}`}>
                        <CardHeader>
                            <feature.icon className="h-10 w-10 text-primary mb-4" />
                            <CardTitle>{feature.title}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {feature.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </section>
    )
}
