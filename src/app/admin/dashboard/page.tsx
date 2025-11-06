
import DepartmentPerformanceTable from "@/components/admin/analytics/department-performance-table";
import StatsGrid from "@/components/admin/analytics/stats-grid";
import TicketTrendsChart from "@/components/admin/analytics/ticket-trends-chart";
import { AiAnalytics } from "@/components/admin/analytics/ai-analytics";
import { SystemNotifications } from "@/components/admin/analytics/system-notifications";
import { AdminAssistant } from "@/components/admin/analytics/admin-assistant";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">System Overview</h1>
                <p className="text-muted-foreground">A real-time, centralized view of the platform’s health and activity.</p>
            </header>
            
            <StatsGrid />
            
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <AdminAssistant />
                    <TicketTrendsChart />
                    <DepartmentPerformanceTable />
                </div>
                <div className="space-y-6">
                    <AiAnalytics />
                    <SystemNotifications />
                </div>
            </div>
        </div>
    )
}
