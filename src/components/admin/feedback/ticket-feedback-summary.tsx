'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Feedback } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Smile, Frown, Meh, Star } from 'lucide-react';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

export function TicketFeedbackSummary() {
    const firestore = useFirestore();

    const feedbackQuery = useMemoFirebase(
      () =>
        firestore
          ? query(collection(firestore, 'ticketFeedback'))
          : null,
      [firestore]
    );

    const { data: feedbacks, isLoading } = useCollection<Feedback>(feedbackQuery);

    const summary = useMemo(() => {
        if (!feedbacks) return { happy: 0, neutral: 0, sad: 0, total: 0, satisfaction: 0 };
        const counts = feedbacks.reduce((acc, feedback) => {
            acc[feedback.mood] = (acc[feedback.mood] || 0) + 1;
            return acc;
        }, {} as Record<Feedback['mood'], number>);
        
        const total = feedbacks.length;
        const happy = counts.happy || 0;
        const neutral = counts.neutral || 0;
        const sad = counts.sad || 0;
        const satisfaction = total > 0 ? Math.round((happy / total) * 100) : 0;

        return { happy, neutral, sad, total, satisfaction };
    }, [feedbacks]);

    return (
        <Card className="h-[480px]">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-xl">Ticket Satisfaction</CardTitle>
                </div>
                 <CardDescription>
                    Overall satisfaction based on feedback for resolved tickets.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                )}
                {!isLoading && (
                    <>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-medium">Overall Satisfaction</p>
                                <span className="text-sm font-bold">{summary.satisfaction}%</span>
                            </div>
                            <Progress value={summary.satisfaction} aria-label={`${summary.satisfaction}% satisfaction`} />
                            <p className="text-xs text-muted-foreground mt-1">{summary.total} total ratings</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-lg border bg-green-50 dark:bg-green-950 p-4">
                                <Smile className="h-8 w-8 text-green-600 mx-auto" />
                                <p className="text-2xl font-bold mt-2">{summary.happy}</p>
                                <p className="text-xs text-muted-foreground">Happy</p>
                            </div>
                            <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-950 p-4">
                                <Meh className="h-8 w-8 text-yellow-600 mx-auto" />
                                <p className="text-2xl font-bold mt-2">{summary.neutral}</p>
                                <p className="text-xs text-muted-foreground">Neutral</p>
                            </div>
                            <div className="rounded-lg border bg-red-50 dark:bg-red-950 p-4">
                                <Frown className="h-8 w-8 text-red-600 mx-auto" />
                                <p className="text-2xl font-bold mt-2">{summary.sad}</p>
                                <p className="text-xs text-muted-foreground">Sad</p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
