'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, Bell, Loader2, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInHours } from 'date-fns';

const ticketStatusColors: Record<Ticket['status'], string> = {
  Open: 'bg-destructive/80 text-destructive-foreground',
  'In Progress': 'bg-chart-4 text-primary-foreground',
  Resolved: 'bg-chart-5 text-primary-foreground',
  Closed: 'bg-secondary text-secondary-foreground',
};

function TicketStatusBadge({ status }: { status: Ticket['status'] }) {
  return <Badge className={cn('text-xs capitalize', ticketStatusColors[status])}>{status}</Badge>;
}

export function RecentTicketsWidget() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const ticketsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(firestore, 'users', user.uid, 'tickets'),
            orderBy('lastUpdated', 'desc'),
            limit(5)
          )
        : null,
    [firestore, user]
  );

  const { data: tickets, isLoading } = useCollection<Ticket>(ticketsQuery);
  const [updatedTicketId, setUpdatedTicketId] = useState<string | null>(null);

  // MOCK REAL-TIME UPDATE for visual alerts demo
  useEffect(() => {
    if (tickets && tickets.length > 0) {
      const timer = setTimeout(() => {
        const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
        setUpdatedTicketId(randomTicket.id);
        const badgeTimer = setTimeout(() => setUpdatedTicketId(null), 3000); // Remove badge after 3s
        return () => clearTimeout(badgeTimer);
      }, 5000); // Trigger update after 5s
      return () => clearTimeout(timer);
    }
  }, [tickets]);


  const needsFollowUp = (ticket: Ticket) => {
    const hoursSinceUpdate = differenceInHours(new Date(), ticket.lastUpdated.toDate());
    return (ticket.status === 'Open' || ticket.status === 'In Progress') && hoursSinceUpdate > 48;
  }

  return (
    <Card className='h-full'>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">Recent Tickets</CardTitle>
        </div>
        <Button variant="link" className="text-sm" asChild>
          <Link href="/tickets">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {!isLoading && (!tickets || tickets.length === 0) && (
          <div className="text-center text-muted-foreground py-4">You have no recent tickets.</div>
        )}
        {!isLoading && tickets && tickets.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map(ticket => (
                <TableRow 
                    key={ticket.id} 
                    className={cn("cursor-pointer", updatedTicketId === ticket.id && "animate-flash-bg")}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                >
                  <TableCell className="font-medium truncate max-w-[200px]">
                    <div className="flex items-center gap-2">
                        {needsFollowUp(ticket) && (
                            <div className="relative">
                                <Bell className="h-4 w-4 text-yellow-500 animate-pulse" />
                            </div>
                        )}
                        <span>{ticket.subject}</span>
                         {updatedTicketId === ticket.id && (
                            <Badge variant="outline" className="text-primary border-primary">Just updated</Badge>
                        )}
                    </div>
                  </TableCell>
                   <TableCell className="text-muted-foreground">
                    {ticket.lastUpdated ? format(ticket.lastUpdated.toDate(), 'PPP') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <TicketStatusBadge status={ticket.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
