'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';


export function TicketSummaryWidget() {
  const { user } = useUser();
  const firestore = useFirestore();

  const allTicketsQuery = useMemoFirebase(
    () => user ? query(collection(firestore, 'users', user.uid, 'tickets')) : null,
    [firestore, user]
  );
  
  const { data: tickets, isLoading } = useCollection<Ticket>(allTicketsQuery);

  const summary = useMemo(() => {
    if (!tickets) return { open: 0, inProgress: 0, resolved: 0 };
    return tickets.reduce((acc, ticket) => {
      if (ticket.status === 'Open') acc.open++;
      if (ticket.status === 'In Progress') acc.inProgress++;
      if (ticket.status === 'Resolved') acc.resolved++;
      return acc;
    }, { open: 0, inProgress: 0, resolved: 0 });
  }, [tickets]);
  
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className="font-headline text-lg">Ticket Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-around items-center h-24">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-16" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2">
                <TicketIcon className="h-5 w-5 text-destructive" />
                <p className="text-2xl font-bold">{summary.open}</p>
              </div>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 text-chart-4" />
                <p className="text-2xl font-bold">{summary.inProgress}</p>
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-chart-5" />
                <p className="text-2xl font-bold">{summary.resolved}</p>
              </div>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    