
'use client';

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

type TicketListClientProps = {
  userId: string;
};

const statusColors: Record<Ticket['status'], string> = {
    Open: 'bg-destructive/80 text-destructive-foreground',
    'In Progress': 'bg-chart-4 text-primary-foreground',
    Resolved: 'bg-chart-5 text-primary-foreground',
    Closed: 'bg-secondary text-secondary-foreground',
};

export function TicketListClient({ userId }: TicketListClientProps) {
    const router = useRouter();
    const firestore = useFirestore();

    const ticketsQuery = useMemoFirebase(
      () => query(collection(firestore, `users/${userId}/tickets`), orderBy('lastUpdated', 'desc')),
      [firestore, userId]
    );

    const { data: tickets, isLoading } = useCollection<Ticket>(ticketsQuery);

    if (isLoading) {
        return (
          <div className="rounded-md border flex-1 flex flex-col p-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )
    }
    
    if (!tickets || tickets.length === 0) {
        return <p className="text-center text-muted-foreground py-6">You have not submitted any tickets yet.</p>;
    }

  return (
    <div className="rounded-md border flex-1 flex flex-col">
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell>{ticket.department}</TableCell>
                <TableCell>
                  <Badge className={cn('capitalize', statusColors[ticket.status])}>{ticket.status}</Badge>
                </TableCell>
                <TableCell>{format(ticket.lastUpdated.toDate(), "PPP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
