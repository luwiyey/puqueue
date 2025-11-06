'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import type { Announcement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AnnouncementsList() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const announcementsQuery = useMemoFirebase(
      () =>
        firestore
          ? query(collection(firestore, 'announcements'), orderBy('postDate', 'desc'), limit(10))
          : null,
      [firestore]
    );
    const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'announcements', id));
            toast({ title: "Announcement Deleted", description: "The announcement has been removed."});
        } catch (error) {
            toast({ title: "Deletion Failed", description: "Could not delete the announcement.", variant: "destructive"});
            console.error("Error deleting announcement:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }
    
    if (!announcements || announcements.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-8">No announcements have been posted yet.</p>
    }

    return (
        <div className="space-y-4">
            {announcements.map(announcement => (
                <Card key={announcement.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription>
                            Posted on {format(announcement.postDate.toDate(), 'PPP')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{announcement.content}</p>
                    </CardContent>
                    <CardFooter>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the announcement.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(announcement.id)} className="bg-destructive hover:bg-destructive/90">
                                    Yes, delete it
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
