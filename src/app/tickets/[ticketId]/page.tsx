
import { doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Ticket } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { TicketTimeline } from '@/components/tickets/ticket-timeline';
import { MessageSquare, User, Tag, Calendar, Building, CheckCircle } from 'lucide-react';
import { TicketFeedbackForm } from '@/components/tickets/ticket-feedback-form';
import { AiReplyGenerator } from '@/components/tickets/ai-reply-generator';
import { getAuth } from 'firebase/auth';

type TicketDetailPageProps = {
    params: { ticketId: string };
};

// This page needs to be dynamically rendered to fetch data for a specific ticket.
export const dynamic = 'force-dynamic';

async function getTicketData(ticketId: string): Promise<Ticket | null> {
    // Note: In a real app, you MUST secure this. This example fetches from a global collection for simplicity.
    // The correct path should be /users/{userId}/tickets/{ticketId}.
    // This requires server-side authentication to get the userId, which is outside this component's scope.
    const { firestore } = initializeFirebase();
    // This is a simplification. In a real app, you'd need to know the user's ID to get the correct path.
    // We are trying multiple potential paths, which is not ideal for production.
    
    // First, try to get from a potential user's subcollection
    // THIS IS A WORKAROUND: We don't have the user ID on the server in this context.
    // In a real app, you would have the user's ID from server-side auth.
    // We'll try a few common paths.
    try {
        const { auth } = initializeFirebase();
        const userId = auth.currentUser?.uid;
        if (userId) {
            const userTicketRef = doc(firestore, 'users', userId, 'tickets', ticketId);
            const userTicketSnap = await getDoc(userTicketRef);
            if (userTicketSnap.exists()) {
                return { id: userTicketSnap.id, ...userTicketSnap.data() } as Ticket;
            }
        }
    } catch(e) {
        // Firebase might not be initialized on the server, so auth.currentUser can fail.
    }


    // Fallback to a global 'tickets' collection if not found in user-specific path
    const ticketRef = doc(firestore, 'tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
        return null;
    }
    return { id: ticketSnap.id, ...ticketSnap.data() } as Ticket;
}


export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
    const ticket = await getTicketData(params.ticketId);

    if (!ticket) {
        notFound();
    }
    
    const statusColors: Record<Ticket['status'], string> = {
        Open: 'bg-destructive/80 text-destructive-foreground',
        'In Progress': 'bg-chart-4 text-primary-foreground',
        Resolved: 'bg-chart-5 text-primary-foreground',
        Closed: 'bg-secondary text-secondary-foreground',
    };

    const isTicketOpen = ticket.status === 'Open' || ticket.status === 'In Progress';

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <header>
                <div className='flex items-center justify-between'>
                    <h1 className="text-3xl font-bold tracking-tight font-headline break-all">{ticket.subject}</h1>
                    <Badge className={`capitalize ${statusColors[ticket.status]}`}>{ticket.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Ticket Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">Submitted On</p>
                            <p className="text-muted-foreground">{ticket.dateSubmitted ? format(ticket.dateSubmitted.toDate(), 'PPP p') : 'N/A'}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">Department</p>
                            <p className="text-muted-foreground">{ticket.department}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 col-span-full">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">Description</p>
                            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isTicketOpen && (
                <>
                    <Separator />
                    <AiReplyGenerator ticket={ticket} />
                </>
            )}

            <Separator />
            
            <div>
                 <h2 className="text-xl font-bold font-headline mb-4">History & Replies</h2>
                 <TicketTimeline history={ticket.history} />
            </div>

            {ticket.status === 'Resolved' && (
                <>
                    <Separator />
                    <TicketFeedbackForm ticketId={ticket.id} ticketSubject={ticket.subject} />
                </>
            )}
        </div>
    );
}
