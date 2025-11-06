'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Clipboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateReplyTemplates } from '@/ai/flows/generate-reply-flow';
import type { Ticket } from '@/lib/types';

interface AiReplyGeneratorProps {
  ticket: Ticket;
}

interface Template {
  title: string;
  content: string;
}

export function AiReplyGenerator({ ticket }: AiReplyGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setTemplates([]);
    try {
      const result = await generateReplyTemplates({
        subject: ticket.subject,
        description: ticket.description,
      });
      setTemplates(result.templates);
    } catch (error) {
      console.error('AI reply generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate AI replies at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied to Clipboard!',
      description: 'The reply template has been copied.',
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold font-headline mb-4">AI-Powered Replies</h2>
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
        Generate AI Reply Templates
      </Button>

      {templates.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {templates.map((template, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">{template.title}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(template.content)}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{template.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
