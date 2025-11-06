'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { AnonymousFeedback } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


export default function FeedbackPage() {
  const [comment, setComment] = useState('');
  const [department, setDepartment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Initialize firestore separately for anonymous access
  const { firestore } = initializeFirebase();

  const departments = ["General", "CSS", "Registrar", "Guidance", "Dean's Office", "Finance", "IT Support", "Library"];

  const handleSubmit = async () => {
    if (!comment.trim() || !department) {
      toast({
        title: 'Please complete the form',
        description: 'A department and comment are required.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
        const feedbackData: AnonymousFeedback = {
            comment,
            department,
            timestamp: serverTimestamp() as any
        };
        const feedbackColRef = collection(firestore, 'anonymousFeedback');
        await addDoc(feedbackColRef, feedbackData);
        
        toast({
            title: 'Thank you for your feedback!',
            description: 'Your anonymous message has been successfully submitted.',
        });
        
        setComment('');
        setDepartment('');

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

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Anonymous Feedback</CardTitle>
          <CardDescription>
            This form is completely anonymous. Your identity will not be recorded. Please share your concerns openly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="department">Target Department</Label>
            <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Select a department for your feedback" />
                </SelectTrigger>
                <SelectContent>
                {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                    {dept}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Feedback Message</Label>
            <Textarea
                id="comment"
                placeholder="Please type your concern or message here... (e.g., regarding tuition fees, facilities, etc.)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || !comment.trim() || !department} className="w-full">
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Anonymously'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
