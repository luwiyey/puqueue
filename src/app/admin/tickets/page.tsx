
import { GlobalTicketList } from "@/components/admin/tickets/global-ticket-list";

export default function AdminTicketsPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Ticket Oversight</h1>
                <p className="text-muted-foreground">
                    View and manage all support tickets across the platform.
                </p>
            </header>
            <GlobalTicketList />
        </div>
    )
}
