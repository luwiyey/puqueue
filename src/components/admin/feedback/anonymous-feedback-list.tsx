'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { AnonymousFeedback } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquareQuote } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function AnonymousFeedbackList() {
    const firestore = useFirestore();

    const feedbackQuery = useMemoFirebase(
      () =>
        firestore
          ? query(collection(firestore, 'anonymousFeedback'), orderBy('timestamp', 'desc'), limit(20))
          : null,
      [firestore]
    );
    const { data: feedbacks, isLoading } = useCollection<AnonymousFeedback>(feedbackQuery);

    return (
        <Card className="h-[480px] flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <MessageSquareQuote className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-xl">Anonymous Feedback Box</CardTitle>
                </div>
                 <CardDescription>
                    Raw, unfiltered feedback submitted by guests and parents. Sender identity is always hidden.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1">
                     <div className="px-6 pb-6">
                        {isLoading && (
                            <div className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        )}
                        {!isLoading && (!feedbacks || feedbacks.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-8">No anonymous feedback has been submitted yet.</p>
                        )}
                        {!isLoading && feedbacks && feedbacks.length > 0 && (
                             <div className="space-y-4">
                                {feedbacks.map(feedback => (
                                    <div key={feedback.id} className="border-l-4 border-primary/50 pl-4 py-3 bg-muted/50 rounded-r-md">
                                        <p className="text-sm italic">"{feedback.comment}"</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-muted-foreground">
                                                Submitted {formatDistanceToNow(feedback.timestamp.toDate(), { addSuffix: true })}
                                            </p>
                                            <Badge variant="secondary">{feedback.department}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
