
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query, orderBy } from 'firebase/firestore';
import type { Appointment } from '@/lib/types';
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

const statusColors: Record<Appointment['status'], string> = {
    Pending: 'bg-yellow-500/80 text-primary-foreground',
    Confirmed: 'bg-green-500/80 text-primary-foreground',
    Cancelled: 'bg-secondary text-secondary-foreground',
};

export function GlobalAppointmentList() {
    const firestore = useFirestore();
    const router = useRouter();

    const appointmentsQuery = useMemoFirebase(
        () => query(collectionGroup(firestore, 'appointments'), orderBy('dateTime', 'desc')),
        [firestore]
    );

    const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && appointments?.map(appointment => (
                         <TableRow key={appointment.id} className="cursor-pointer" onClick={() => {
                             // Future: Navigate to a detailed appointment view
                             // router.push(`/admin/appointments/${appointment.id}`)
                         }}>
                            <TableCell className="font-medium">{appointment.department}</TableCell>
                            <TableCell className="font-mono text-xs">{appointment.studentId}</TableCell>
                            <TableCell>{format(appointment.dateTime.toDate(), 'PPp')}</TableCell>
                            <TableCell>
                                <Badge className={cn('capitalize', statusColors[appointment.status])}>{appointment.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">{appointment.type}</Badge>
                            </TableCell>
                         </TableRow>
                    ))}
                </TableBody>
            </Table>
             {!isLoading && appointments?.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    No appointments found across the platform.
                </div>
            )}
        </div>
    );
}
