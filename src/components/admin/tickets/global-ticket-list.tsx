
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const statusColors: Record<Ticket['status'], string> = {
    Open: 'bg-destructive/80 text-destructive-foreground',
    'In Progress': 'bg-chart-4 text-primary-foreground',
    Resolved: 'bg-chart-5 text-primary-foreground',
    Closed: 'bg-secondary text-secondary-foreground',
};

export function GlobalTicketList() {
    const firestore = useFirestore();
    const router = useRouter();

    const ticketsQuery = useMemoFirebase(
        () => query(collectionGroup(firestore, 'tickets'), orderBy('lastUpdated', 'desc')),
        [firestore]
    );

    const { data: tickets, isLoading } = useCollection<Ticket>(ticketsQuery);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && tickets?.map(ticket => (
                         <TableRow key={ticket.id} className="cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                            <TableCell className="font-medium max-w-xs truncate">{ticket.subject}</TableCell>
                            <TableCell className="font-mono text-xs">{ticket.studentId}</TableCell>
                            <TableCell>{ticket.department}</TableCell>
                            <TableCell>
                                <Badge className={cn('capitalize', statusColors[ticket.status])}>{ticket.status}</Badge>
                            </TableCell>
                            <TableCell>{format(ticket.lastUpdated.toDate(), 'PPp')}</TableCell>
                         </TableRow>
                    ))}
                </TableBody>
            </Table>
             {!isLoading && tickets?.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No tickets found across the platform.
                </div>
            )}
        </div>
    );
}
