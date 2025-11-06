'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Announcement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

export function AcademicCalendarWidget() {
  const firestore = useFirestore();
  const announcementsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'announcements'),
            where('postDate', '>=', Timestamp.now()),
            orderBy('postDate', 'asc')
          )
        : null,
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Announcement>(announcementsQuery);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">Academic Calendar</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {!isLoading && (!events || events.length === 0) && (
          <div className="text-center text-muted-foreground py-4">
            No upcoming events or deadlines in the calendar.
          </div>
        )}
        {!isLoading && events && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex cursor-pointer items-start gap-4 rounded-lg p-2 transition-colors hover:bg-accent">
                <div className="flex-shrink-0 text-center rounded-md border p-2">
                    <p className="text-sm font-bold text-primary">{format(event.postDate.toDate(), 'MMM')}</p>
                    <p className="text-xl font-bold">{format(event.postDate.toDate(), 'dd')}</p>
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
