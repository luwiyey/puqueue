
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
import { addDocumentNonBlocking, useAuth, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import type { Ticket } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { polishText } from '@/ai/flows/polish-text-flow';
import { useDebounce } from 'use-debounce';
import { CategorizeTicketOutput, categorizeTicket } from '@/ai/flows/categorize-ticket-flow';
import { predictiveHelp } from '@/ai/flows/predictive-help-flow';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [subject, setSubject] = React.useState(searchParams.get('subject') || '');
  const [department, setDepartment] = React.useState(searchParams.get('department') || '');
  const [description, setDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [isPolishing, setIsPolishing] = React.useState(false);
  const [isCategorizing, setIsCategorizing] = React.useState(false);
  const [isPredicting, setIsPredicting] = React.useState(false);
  
  const [categorizationResult, setCategorizationResult] = React.useState<CategorizeTicketOutput | null>(null);
  const [predictiveSuggestion, setPredictiveSuggestion] = React.useState<string | null>(null);

  const [isPredictiveHelpEnabled, setIsPredictiveHelpEnabled] = React.useState(true);

  const [debouncedSubject] = useDebounce(subject, 750);
  const [debouncedDescription] = useDebounce(description, 750);

  const departments = ["Dean's Office", "Registrar", "Guidance", "CSS", "Finance", "Legal Office", "IT Support", "Library"];

  React.useEffect(() => {
    // Check localStorage for the A/B test setting.
    const savedValue = localStorage.getItem('ab-test-predictive-help');
    setIsPredictiveHelpEnabled(savedValue !== 'false');
  }, []);

  // AI Effect for Categorization
  React.useEffect(() => {
    if (debouncedSubject && debouncedDescription && !department) {
      setIsCategorizing(true);
      categorizeTicket({ title: debouncedSubject, description: debouncedDescription })
        .then(result => {
          // Check if the suggested department is one of the valid options
          if(departments.includes(result.department)) {
            setCategorizationResult(result);
          } else {
            console.warn(`AI suggested an invalid department: ${result.department}. Ignoring.`);
            setCategorizationResult(null);
          }
        })
        .catch(err => console.error("Categorization failed:", err))
        .finally(() => setIsCategorizing(false));
    }
  }, [debouncedSubject, debouncedDescription, department]);
  
  // AI Effect for Predictive Help
  React.useEffect(() => {
    if ((debouncedSubject || debouncedDescription) && isPredictiveHelpEnabled) {
        setIsPredicting(true);
        setPredictiveSuggestion(null); // Clear previous suggestion
        predictiveHelp({ title: debouncedSubject, description: debouncedDescription })
            .then(result => {
                // Only show suggestion if it's not the default "proceed" message
                if (result.suggestion && !result.suggestion.toLowerCase().includes('proceed')) {
                    setPredictiveSuggestion(result.suggestion);
                } else {
                    setPredictiveSuggestion(null);
                }
            })
            .catch(err => {
                console.error("Predictive help failed:", err);
                setPredictiveSuggestion(null);
            })
            .finally(() => setIsPredicting(false));
    } else {
        setPredictiveSuggestion(null);
    }
  }, [debouncedSubject, debouncedDescription, isPredictiveHelpEnabled]);

  const handlePolishText = async () => {
    if (!description) return;
    setIsPolishing(true);
    try {
      const result = await polishText({ text: description });
      setDescription(result.polishedText);
    } catch (error) {
      toast({ title: 'Polishing failed', description: 'Could not improve the text at this time.', variant: 'destructive' });
    } finally {
      setIsPolishing(false);
    }
  };

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
        toast({ title: 'Not Authenticated', description: 'You must be logged in to submit a ticket.', variant: 'destructive' });
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

        // If the selected department is Registrar, run categorization to get documentType
        if (department === 'Registrar') {
            try {
                const result = await categorizeTicket({ title: subject, description: description });
                if (result.documentType) {
                    ticketData.documentType = result.documentType;
                }
            } catch (aiError) {
                console.error("AI Sorter failed for Registrar ticket, submitting without documentType:", aiError);
            }
        }


        const ticketsColRef = collection(firestore, 'users', auth.currentUser.uid, 'tickets');
        addDocumentNonBlocking(ticketsColRef, ticketData);
        
        toast({
            title: 'Ticket Submitted!',
            description: `Your request has been sent to the ${department}.`,
        });

        router.push('/tickets');
    } catch (error) {
        console.error('Failed to submit ticket:', error);
        toast({ title: 'Submission Failed', description: 'There was an error submitting your ticket.', variant: 'destructive'});
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
       <header>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Submit a New Ticket</h1>
        <p className="text-muted-foreground">
          Fill out the form below to get help from a university department.
        </p>
      </header>

      {isPredictiveHelpEnabled && predictiveSuggestion && (
        <Alert variant="default" className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <Lightbulb className="h-4 w-4 !text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Hold on!</strong> Based on what you've written, you might not need a ticket. {predictiveSuggestion}
            </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        placeholder="e.g., Question about tuition fee payment"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={setDepartment} value={department}>
                        <SelectTrigger id="department" className="w-full">
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
                     {isCategorizing && <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="animate-spin h-3 w-3"/> AI is suggesting a department...</p>}
                    {categorizationResult && !department && (
                        <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                           AI Suggestion:{" "}
                            <Button variant="link" className="p-0 h-auto" onClick={() => setDepartment(categorizationResult.department)}>
                                <Badge>{categorizationResult.department}</Badge>
                            </Button>
                             <span className="text-xs">({categorizationResult.reasoning})</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="description">Description</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handlePolishText} disabled={isPolishing || !description}>
                        {isPolishing ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Polish with AI
                        </Button>
                    </div>
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
        </CardContent>
      </Card>
    </div>
  );
}

    