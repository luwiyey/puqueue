
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, UserPlus, AlertCircle, RefreshCw } from "lucide-react";

// This component will eventually fetch from /notifications or a dedicated system_events collection in Firestore.
const notifications = [
    { id: 4, icon: RefreshCw, text: "AI knowledge base is outdated (90+ days). Consider re-training.", time: "1d ago", type: 'warning' },
    { id: 1, icon: UserPlus, text: "New user 'student@panpacificu.edu.ph' registered.", time: "5m ago" },
    { id: 2, icon: UserPlus, text: "New anonymous guest session started.", time: "2h ago" },
    { id: 3, icon: AlertCircle, text: "High ticket volume reported for 'CSS' department.", time: "1d ago" },
]

export function SystemNotifications() {
    const getIcon = (item: typeof notifications[0]) => {
        if (item.type === 'warning') return <RefreshCw className="h-5 w-5 text-yellow-500" />;
        return <item.icon className="h-5 w-5 text-muted-foreground" />
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-xl">System Event Feed</CardTitle>
                </div>
                <CardDescription>A real-time feed of platform activity and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {notifications.map(notif => (
                     <div key={notif.id} className="flex items-start gap-3">
                        <div className="mt-1">
                            {getIcon(notif)}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">{notif.text}</p>
                            <p className="text-xs text-muted-foreground">{notif.time}</p>
                        </div>
                     </div>
                ))}
            </CardContent>
        </Card>
    );
}
