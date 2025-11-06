
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit } from "lucide-react";


export function AiRoutingAccuracy() {
    const accuracy = 92; // Mock data
    
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline">AI Routing Accuracy</CardTitle>
                <CardDescription>How accurately the AI routes incoming requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                        <BrainCircuit className="h-7 w-7" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">Categorization Accuracy</p>
                            <span className="text-lg font-bold">{accuracy}%</span>
                        </div>
                        <Progress value={accuracy} aria-label={`${accuracy}% AI routing accuracy`} />
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground">Based on staff corrections over the last 30 days.</p>
            </CardContent>
        </Card>
    );
}
