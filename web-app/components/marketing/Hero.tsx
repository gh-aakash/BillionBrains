import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center pt-32 pb-20 text-center overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute top-0 -z-10 h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            {/* Badge */}
            <div className="mb-8 inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm font-medium text-zinc-800 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                <span>The Implementation Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
                Don&apos;t Let Your Ideas <br />
                <span className="bg-gradient-to-r from-zinc-500 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">
                    Die In Isolation.
                </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Billion Brains is the place where builders meet.
                Post your idea, build your team, and turn raw thoughts into execution.
                Capital follows proof.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent/10 backdrop-blur-sm">
                    Explore Ideas
                </Button>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground/60">
                <div><span className="font-bold text-foreground">1,200+</span> Builders</div>
                <div><span className="font-bold text-foreground">350+</span> Active Projects</div>
                <div><span className="font-bold text-foreground">$0</span> Required to Start</div>
            </div>
        </section>
    )
}
