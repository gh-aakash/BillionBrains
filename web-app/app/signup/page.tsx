"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit, Loader2 } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")
    const [role, setRole] = React.useState<string>("creator")

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.target as HTMLFormElement)
        formData.append("role", role)

        const { signupAction } = await import("@/app/actions/signup")
        const result = await signupAction(formData) as { error?: string; success?: boolean }

        setIsLoading(false)

        if (result?.error) {
            setError(result.error)
        } else {
            router.push("/login?registered=true")
        }
    }

    return (
        <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/login"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8"
                )}
            >
                Login
            </Link>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-neutral-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <BrainCircuit className="mr-2 h-6 w-6" />
                    Billion Brains
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform changed everything. I found my co-founder here, and we raised our pre-seed safely through the smart contract escrow.&rdquo;
                        </p>
                        <footer className="text-sm">Alex Chen, Founder of NeuralNet</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Join the network of builders and visionaries.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <Tabs defaultValue="creator" onValueChange={setRole} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="creator">I want to Build</TabsTrigger>
                                <TabsTrigger value="investor">I want to Invest</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form onSubmit={onSubmit}>
                            <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        placeholder="Full Name"
                                        type="text"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder={role === 'creator' ? "Tell us what you build..." : "What sectors do you invest in?"}
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && <p className="text-sm text-red-500">{error}</p>}

                                <Button disabled={isLoading}>
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
