
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, CheckCircle, ShieldCheck, Crosshair, BrainCircuit } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// This component will eventually pull from /ai_logs or a dedicated metrics collection in Firestore
export function AiAnalytics() {
    const successRate = 83; // Mock data
    const avgResponseTime = 850; // Mock data in ms
    const modelAccuracy = 87; // Mock data
    const modelPrecision = 91; // Mock data
    const modelRecall = 84; // Mock data
    const uptime = 99.9; // Mock data

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-xl">AI Performance & Accuracy</CardTitle>
                </div>
                <CardDescription>Key metrics for AI response, accuracy, and uptime.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">AI Resolution Rate</p>
                        <span className="text-sm font-bold">{successRate}%</span>
                    </div>
                    <Progress value={successRate} aria-label={`${successRate}% of issues resolved by AI`} />
                    <p className="text-xs text-muted-foreground mt-1">Tickets resolved without staff intervention.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                     <div className="rounded-lg border bg-card text-card-foreground p-3 space-y-1">
                        <div className="flex items-center justify-center gap-2">
                             <Zap className="h-4 w-4 text-muted-foreground" />
                             <p className="text-xs text-muted-foreground">Avg. Latency</p>
                        </div>
                        <p className="text-2xl font-bold">{avgResponseTime}<span className="text-base font-normal">ms</span></p>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground p-3 space-y-1">
                         <div className="flex items-center justify-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Uptime</p>
                        </div>
                        <p className="text-2xl font-bold">{uptime}<span className="text-base font-normal">%</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border bg-card text-card-foreground p-3 space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <Crosshair className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Accuracy</p>
                        </div>
                        <p className="text-xl font-bold">{modelAccuracy}<span className="text-sm font-normal">%</span></p>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground p-3 space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Precision</p>
                        </div>
                        <p className="text-xl font-bold">{modelPrecision}<span className="text-sm font-normal">%</span></p>
                    </div>
                     <div className="rounded-lg border bg-card text-card-foreground p-3 space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Recall</p>
                        </div>
                        <p className="text-xl font-bold">{modelRecall}<span className="text-sm font-normal">%</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
