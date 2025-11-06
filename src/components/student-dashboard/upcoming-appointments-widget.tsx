'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp, limit } from 'firebase/firestore';
import type { Appointment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, CalendarCheck, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const appointmentStatusColors: Record<Appointment['status'], string> = {
  Pending: 'bg-yellow-500/80 text-primary-foreground',
  Confirmed: 'bg-green-500/80 text-primary-foreground',
  Cancelled: 'bg-secondary text-secondary-foreground',
};

function AppointmentStatusBadge({ status }: { status: Appointment['status'] }) {
  return <Badge className={cn('text-xs capitalize', appointmentStatusColors[status])}>{status}</Badge>;
}

export function UpcomingAppointmentsWidget() {
    const { user } = useUser();
    const firestore = useFirestore();
  
    const appointmentsQuery = useMemoFirebase(
      () =>
        user
          ? query(
              collection(firestore, 'users', user.uid, 'appointments'),
              where('dateTime', '>=', Timestamp.now()),
              orderBy('dateTime', 'asc'),
              limit(2) 
            )
          : null,
      [firestore, user]
    );
  
    const { data: appointments, isLoading } = useCollection<Appointment>(appointmentsQuery);
  
    return (
      <Card className='h-full'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-xl">Upcoming Appointments</CardTitle>
            </div>
             <Button variant="link" className="text-sm" asChild>
                <Link href="/appointments">Manage</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <div className="space-y-2"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>}
          {!isLoading && (!appointments || appointments.length === 0) && (
            <div className="text-center text-muted-foreground py-4">No upcoming appointments.</div>
          )}
          {!isLoading && appointments && appointments.map(appt => (
            <div key={appt.id} className="flex items-center space-x-4 rounded-md border p-4">
              <CalendarCheck className="h-8 w-8 text-primary hidden sm:block" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold leading-none">{appt.department}</p>
                        <p className="text-sm text-muted-foreground">{appt.dateTime ? format(appt.dateTime.toDate(), 'PPP p') : 'Date not set'}</p>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <AppointmentStatusBadge status={appt.status} />
                      <Badge variant="outline" className="capitalize">{appt.type}</Badge>
                    </div>
                </div>
                {appt.type === 'Virtual' && appt.meetingLink && (
                  <Button asChild size="sm" className="mt-2 w-full sm:w-auto">
                    <a href={appt.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="mr-2 h-4 w-4"/>
                      Join Meeting
                    </a>
                  </Button>
                )}
                 {appt.type === 'Virtual' && !appt.meetingLink && (
                  <p className="text-xs text-muted-foreground pt-1">Meeting link will be provided by staff.</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
}
