'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Announcement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Megaphone } from 'lucide-react';

export function AnnouncementsWidget() {
  const firestore = useFirestore();
  const announcementsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'announcements'), orderBy('postDate', 'desc'), limit(3))
        : null,
    [firestore]
  );
  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

  return (
    <Card className='h-full'>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-xl">Announcements</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2 px-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        )}
        {!isLoading && (!announcements || announcements.length === 0) && (
            <div className="text-center text-muted-foreground py-4">No announcements right now.</div>
        )}
        {!isLoading && announcements && announcements.length > 0 && (
             <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="flex cursor-pointer items-start gap-4 rounded-lg p-2 transition-colors hover:bg-accent">
                        <div className="flex-shrink-0 text-center">
                            <p className="text-sm font-bold text-primary">{format(announcement.postDate.toDate(), 'MMM')}</p>
                            <p className="text-xl font-bold">{format(announcement.postDate.toDate(), 'dd')}</p>
                        </div>
                        <div className="flex-1 border-l-2 border-primary pl-4">
                            <p className="font-semibold">{announcement.title}</p>
                            <p className="text-sm text-muted-foreground">{announcement.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
