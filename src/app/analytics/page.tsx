import { ActivityTracker } from "@/components/student-analytics/activity-tracker";
import { AIInteractionLog } from "@/components/student-analytics/ai-interaction-log";
import { AppointmentInsights } from "@/components/student-analytics/appointment-insights";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Analytics</h1>
        <p className="text-muted-foreground">
          An overview of your interactions and activity.
        </p>
      </header>
      
      <div className="grid gap-8">
        <ActivityTracker />
        <div className="grid gap-8 lg:grid-cols-2">
            <AppointmentInsights />
            <AIInteractionLog />
        </div>
      </div>
    </div>
  );
}
