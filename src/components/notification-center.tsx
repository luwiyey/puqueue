
'use client';

import { useState } from 'react';
import { Bell, Ticket, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);

  const notificationsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(firestore, `users/${user.uid}/notifications`),
            orderBy('createdAt', 'desc'),
            limit(10)
          )
        : null,
    [firestore, user]
  );

  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && notifications && user) {
      // Mark all visible notifications as read
      notifications.forEach(notification => {
        if (!notification.isRead) {
          const notifRef = doc(firestore, `users/${user.uid}/notifications`, notification.id);
          updateDoc(notifRef, { isRead: true });
        }
      });
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ticket':
        return <Ticket className="h-5 w-5 text-primary" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  }
  
  const getLink = (notification: Notification) => {
      switch(notification.type) {
          case 'ticket':
              return `/tickets/${notification.referenceId}`;
          case 'appointment':
              return '/appointments';
          default:
              return '#';
      }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-foreground/80 hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 md:w-96" align="end">
        <Card className="border-0">
          <CardHeader className="border-b">
            <CardTitle className="font-headline">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto p-0">
            {isLoading && <div className="p-4 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>}
            
            {!isLoading && (!notifications || notifications.length === 0) && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    You have no new notifications.
                </div>
            )}

            {!isLoading && notifications && notifications.length > 0 && (
                <div className="divide-y">
                    {notifications.map(notification => (
                        <Link href={getLink(notification)} key={notification.id} className="block" onClick={() => setIsOpen(false)}>
                            <div className={cn(
                                "flex items-start gap-4 p-4 hover:bg-muted/50",
                                !notification.isRead && "bg-primary/5"
                            )}>
                                <div className="mt-1">{getIcon(notification.type)}</div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
                                    </p>
                                </div>
                                {!notification.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
