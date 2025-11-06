import { AnonymousFeedbackList } from "@/components/admin/feedback/anonymous-feedback-list";
import { TicketFeedbackSummary } from "@/components/admin/feedback/ticket-feedback-summary";

export default function AdminFeedbackPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline">Feedback & Ratings</h1>
                <p className="text-muted-foreground">
                    Review user feedback and satisfaction scores.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-2">
                <TicketFeedbackSummary />
                <AnonymousFeedbackList />
            </div>

        </div>
    )
}
