"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { BrainCircuit, Sparkles, Rocket, Loader2, CheckCircle } from "lucide-react"
import { launchProjectAction } from "@/app/actions/project"
import { useRouter } from "next/navigation"

export function LaunchWizard({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
    const router = useRouter()
    const [step, setStep] = useState<"input" | "analyzing" | "success">("input")
    const [analysisText, setAnalysisText] = useState("Initializing AI Agent...")
    const [formData, setFormData] = useState({ title: "", description: "", industry: "" })

    async function handleLaunch() {
        setStep("analyzing")

        // Mock AI Steps Animation
        const steps = [
            "Scanning Industry Trends...",
            "Estimating Funding Requirements...",
            "Generating Strategic Roadmap...",
            "Finalizing Project Structure..."
        ]

        for (const s of steps) {
            setAnalysisText(s)
            await new Promise(r => setTimeout(r, 800))
        }

        const res = await launchProjectAction(formData.title, formData.description, formData.industry)

        if (res.success && res.project) {
            setStep("success")
            // Redirect after short delay
            setTimeout(() => {
                router.push(`/dashboard/creator?projectId=${res.project.id}`)
                onOpenChange(false)
                setStep("input") // Reset
            }, 1000)
        } else {
            setStep("input") // Fail silently for demo or add error state
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                {step === "input" && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                AI Project Launchpad
                            </DialogTitle>
                            <DialogDescription>
                                Turn your rough idea into a structured project plan instantly.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Project Name</Label>
                                <Input
                                    placeholder="e.g. NeuralNet Crypto Exchange"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Industry</Label>
                                <Input
                                    placeholder="e.g. Crypto, SaaS, BioTech"
                                    value={formData.industry}
                                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>What are you building?</Label>
                                <Textarea
                                    placeholder="Describe your vision..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleLaunch} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                                <BrainCircuit className="mr-2 h-4 w-4" />
                                Generate Project Plan
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === "analyzing" && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                            <BrainCircuit className="h-16 w-16 text-purple-600 animate-bounce" />
                        </div>
                        <h3 className="text-lg font-semibold animate-pulse">{analysisText}</h3>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <h3 className="text-lg font-bold">Project Created!</h3>
                        <p className="text-muted-foreground">Redirecting to board...</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
