'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { summarizeTicket } from '@/ai/flows/ticket-summary';
import { addDocumentNonBlocking, useAuth, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';
import { useRouter } from 'next/navigation';

const departments = ['IT Support', 'Admissions', 'Financial Aid', 'Housing'];

export function NewTicketForm() {
  const [subject, setSubject] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !department || !description) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill out all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!auth.currentUser) {
        toast({
            title: 'Not Authenticated',
            description: 'You must be logged in to submit a ticket.',
            variant: 'destructive'
        });
        return;
    }

    setIsSubmitting(true);
    
    try {
        const ticketData: Omit<Ticket, 'id'> = {
            subject,
            department,
            description,
            status: 'Open',
            studentId: auth.currentUser.uid,
            dateSubmitted: serverTimestamp() as any,
            lastUpdated: serverTimestamp() as any,
        };

        const ticketsColRef = collection(firestore, 'users', auth.currentUser.uid, 'tickets');
        addDocumentNonBlocking(ticketsColRef, ticketData);
        
        summarizeTicket({ ticketContent: `${subject}\n\n${description}` }).then(summaryResult => {
             console.log('AI Summary:', summaryResult);
        });

        toast({
            title: 'Ticket Submitted!',
            description: `Your request has been sent to ${department}.`,
        });

        // Reset form
        setSubject('');
        setDepartment('');
        setDescription('');
        router.push('/tickets');
    } catch (error) {
        console.error('Failed to submit ticket:', error);
        toast({
            title: 'Submission Failed',
            description: 'There was an error submitting your ticket. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="e.g., Wi-Fi not working"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select onValueChange={setDepartment} value={department}>
            <SelectTrigger id="department">
              <SelectValue placeholder="Select a department" />
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your issue in detail..."
          className="min-h-[150px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
      </Button>
    </form>
  );
}
