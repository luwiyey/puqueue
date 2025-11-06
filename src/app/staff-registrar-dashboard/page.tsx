
'use client';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { RegistrarStatsGrid } from '@/components/staff/registrar/RegistrarStatsGrid';
import { RequestVolumeChart } from '@/components/staff/registrar/RequestVolumeChart';
import { TopDocumentsList } from '@/components/staff/registrar/TopDocumentsList';
import { AverageReleaseTimeChart } from '@/components/staff/registrar/AverageReleaseTimeChart';
import { PendingVsCompletedChart } from '@/components/staff/registrar/PendingVsCompletedChart';
import { AiRoutingAccuracy } from '@/components/staff/registrar/AiRoutingAccuracy';


export default function StaffRegistrarDashboardPage() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <header>
                 <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Welcome, {user?.displayName || "Registrar Staff"}!
                </h1>
                <p className="text-muted-foreground">
                    Here's an overview of the document requests and office activity.
                </p>
            </header>
            
            <RegistrarStatsGrid />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RequestVolumeChart />
                </div>
                <div className="lg:col-span-1">
                    <TopDocumentsList />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AverageReleaseTimeChart />
                </div>
                <div className="space-y-6">
                    <PendingVsCompletedChart />
                    <AiRoutingAccuracy />
                </div>
            </div>
        </div>
    );
}
