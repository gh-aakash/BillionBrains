import Link from "next/link"
import { BrainCircuit } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
                <div className="flex-1 space-y-4">
                    <Link href="/" className="flex items-center space-x-2 font-bold">
                        <BrainCircuit className="h-6 w-6" />
                        <span>Billion Brains</span>
                    </Link>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        The execution network where ideas become products.
                        Connect, collaborate, and ship.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                    <div className="flex flex-col space-y-3">
                        <h4 className="font-medium">Product</h4>
                        <Link href="/feed" className="text-sm text-muted-foreground hover:text-primary">
                            Global Feed
                        </Link>
                        <Link href="/teams" className="text-sm text-muted-foreground hover:text-primary">
                            Find Teams
                        </Link>
                        <Link href="/antigravity" className="text-sm text-muted-foreground hover:text-primary">
                            Antigravity IDE
                        </Link>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <h4 className="font-medium">Company</h4>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                            Manifesto
                        </Link>
                        <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                            Careers
                        </Link>
                        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                            Blog
                        </Link>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <h4 className="font-medium">Legal</h4>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container border-t py-6">
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Billion Brains Inc. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
