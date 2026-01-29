import Link from "next/link"
import {
    LayoutDashboard,
    PlusCircle,
    Users,
    Settings,
    LogOut,
    BrainCircuit,
    Search
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-muted/40">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="flex h-14 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BrainCircuit className="h-6 w-6" />
                        <span>Billion Brains</span>
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Global Feed
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Users className="h-4 w-4" />
                            My Profile
                        </Link>
                        <Link
                            href="/dashboard/teams"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Users className="h-4 w-4" />
                            Active Teams
                        </Link>
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto p-4">
                    <Button size="sm" className="w-full gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Idea
                    </Button>
                    <div className="mt-4 border-t pt-4">
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    {/* Mobile Menu Trigger would go here */}
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search ideas, skills, or builders..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] h-9 border border-input text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <img
                            src="https://github.com/shadcn.png"
                            width={32}
                            height={32}
                            className="rounded-full"
                            alt="Avatar"
                        />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </header>

                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
