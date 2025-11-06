'use client';

import { ThemeCustomizer } from "@/components/admin/settings/theme-customizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
    const [isPredictiveHelpEnabled, setIsPredictiveHelpEnabled] = useState(true);
    const [isSandboxModeEnabled, setIsSandboxModeEnabled] = useState(false);

    useEffect(() => {
        // A/B Test Setting
        const savedABValue = localStorage.getItem('ab-test-predictive-help');
        setIsPredictiveHelpEnabled(savedABValue !== 'false');

        // Sandbox Mode Setting
        const savedSandboxValue = localStorage.getItem('sandbox-mode');
        setIsSandboxModeEnabled(savedSandboxValue === 'true');
    }, []);

    const handlePredictiveHelpToggle = (enabled: boolean) => {
        setIsPredictiveHelpEnabled(enabled);
        localStorage.setItem('ab-test-predictive-help', String(enabled));
    };

    const handleSandboxModeToggle = (enabled: boolean) => {
        setIsSandboxModeEnabled(enabled);
        localStorage.setItem('sandbox-mode', String(enabled));
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">System Configuration</h1>
                <p className="text-muted-foreground">
                    Manage system-wide settings and appearance.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Theme Customization</CardTitle>
                    <CardDescription>
                        Customize the dashboard colors, logo, and institution details.
                        Changes are saved locally in your browser.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeCustomizer />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>A/B Testing & Experimental Features</CardTitle>
                    <CardDescription>
                        Enable or disable certain features to test their impact. Settings are saved locally in your browser.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="predictive-help-switch" className="font-medium">
                                Predictive Help AI
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Suggest solutions to users as they type a new ticket.
                            </p>
                        </div>
                        <Switch
                            id="predictive-help-switch"
                            checked={isPredictiveHelpEnabled}
                            onCheckedChange={handlePredictiveHelpToggle}
                        />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="sandbox-mode-switch" className="font-medium">
                                Developer Sandbox Mode
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Enable experimental features in a safe environment.
                            </p>
                        </div>
                        <Switch
                            id="sandbox-mode-switch"
                            checked={isSandboxModeEnabled}
                            onCheckedChange={handleSandboxModeToggle}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
