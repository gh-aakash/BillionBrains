import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, GitMerge } from "lucide-react"

// Mock Data for the Feed
const feedItems = [
    {
        author: "Sarah Chen",
        role: "AI Researcher",
        avatar: "https://github.com/shadcn.png",
        time: "2h ago",
        title: "EcoSwap: Decentralized Carbon Credits",
        description: "A marketplace where local businesses can trade carbon credits directly with consumers using L2 rollups. The math is solid, but I need help with the smart contract implementation.",
        tags: ["Blockchain", "Solidity", "React"],
        lookingFor: ["Smart Contract Dev", "Frontend Dev"],
        likes: 24,
        comments: 5,
    },
    {
        author: "David Miller",
        role: "Product Designer",
        avatar: "https://github.com/shadcn.png",
        time: "5h ago",
        title: "Vocalize: AI Speech Therapy Assistant",
        description: "Real-time phonetics feedback for stroke victims. I have the UX prototypes and initial dataset. Need a Rust engineer to build the audio processing engine.",
        tags: ["Rust", "Audio Processing", "Mobile App"],
        lookingFor: ["Rust Engineer", "Mobile Dev"],
        likes: 89,
        comments: 12,
    }
]

export default function FeedPage() {
    return (
        <div className="mx-auto grid w-full max-w-3xl items-start gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Global Feed</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Trending</Button>
                    <Button variant="outline" size="sm">Recent</Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Use map to render items */}
                {feedItems.map((item, i) => (
                    <Card key={i} className="overflow-hidden">
                        {/* Header */}
                        <CardHeader className="flex flex-row items-start gap-4 p-6">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={item.avatar} alt={item.author} />
                                <AvatarFallback>{item.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{item.author}</span>
                                    <span className="text-xs text-muted-foreground">• {item.role}</span>
                                    <span className="text-xs text-muted-foreground">• {item.time}</span>
                                </div>
                                <CardTitle className="text-xl mt-1">{item.title}</CardTitle>
                            </div>
                        </CardHeader>
                        {/* Content */}
                        <CardContent className="p-6 pt-0">
                            <p className="text-muted-foreground mb-4">
                                {item.description}
                            </p>

                            {/* Looking For Section */}
                            <div className="mb-4 rounded-md bg-muted p-3">
                                <span className="text-xs font-medium uppercase text-muted-foreground mr-2">Looking For:</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {item.lookingFor.map((role) => (
                                        <Badge key={role} variant="secondary" className="bg-background text-foreground border-border">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">#{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        {/* Footer */}
                        <CardFooter className="flex items-center justify-between border-t bg-muted/50 p-4">
                            <div className="flex gap-4 text-muted-foreground">
                                <Button variant="ghost" size="sm" className="gap-2 px-0">
                                    <ThumbsUp className="h-4 w-4" />
                                    {item.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2 px-0">
                                    <MessageSquare className="h-4 w-4" />
                                    {item.comments}
                                </Button>
                            </div>
                            <Button size="sm" className="gap-2">
                                <GitMerge className="h-4 w-4" />
                                Request to Join
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
