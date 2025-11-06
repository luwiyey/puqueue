'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import type { Feedback } from '@/lib/types';
import { Smile, Frown, Meh, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateAppreciationMessage } from '@/ai/flows/generate-appreciation-message-flow';
import { Alert, AlertDescription } from '../ui/alert';

interface TicketFeedbackFormProps {
  ticketId: string;
  ticketSubject: string;
}

export function TicketFeedbackForm({ ticketId, ticketSubject }: TicketFeedbackFormProps) {
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appreciationMessage, setAppreciationMessage] = useState('');
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!mood) {
      toast({
        title: 'Please select your rating',
        description: 'Click on one of the faces to rate your experience.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
        toast({ title: 'Not authenticated', variant: 'destructive'});
        return;
    }

    setIsSubmitting(true);
    
    try {
        const feedbackData: Feedback = {
            mood,
            comment: comment || undefined,
            ticketId: ticketId,
            userId: user.uid,
            timestamp: serverTimestamp() as any,
        };
        const feedbackColRef = collection(firestore, 'ticketFeedback');
        await addDocumentNonBlocking(feedbackColRef, feedbackData);
        
        const studentName = user.displayName?.split(' ')[0] || 'Student';
        const aiResponse = await generateAppreciationMessage({ studentName, ticketSubject });
        setAppreciationMessage(aiResponse.message);

        setIsSubmitted(true);
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        toast({
            title: 'Submission Failed',
            description: 'Could not submit your feedback. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
      return (
          <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <Smile className="h-4 w-4 !text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-300">
                {appreciationMessage || "Thank you for your feedback! We appreciate you taking the time to let us know how we did."}
            </AlertDescription>
          </Alert>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>How was our service?</CardTitle>
        <CardDescription>
          Your feedback helps us improve our support for the ticket: "{ticketSubject}".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className={cn('h-16 w-16 rounded-full transition-all duration-200', mood === 'happy' && 'bg-green-100 border-green-400 scale-110')}
            onClick={() => setMood('happy')}
          >
            <Smile className="h-8 w-8 text-green-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn('h-16 w-16 rounded-full transition-all duration-200', mood === 'neutral' && 'bg-yellow-100 border-yellow-400 scale-110')}
            onClick={() => setMood('neutral')}
          >
            <Meh className="h-8 w-8 text-yellow-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn('h-16 w-16 rounded-full transition-all duration-200', mood === 'sad' && 'bg-red-100 border-red-400 scale-110')}
            onClick={() => setMood('sad')}
          >
            <Frown className="h-8 w-8 text-red-600" />
          </Button>
        </div>
        <Textarea
          placeholder="Add an optional comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={isSubmitting || !mood}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
            Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
}
