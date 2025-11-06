'use server';
/**
 * @fileOverview Summarizes ticket information for admins to identify trends and resolve them efficiently.
 *
 * - summarizeTicket - A function that takes ticket content and returns a summary.
 * - TicketSummaryInput - The input type for the summarizeTicket function.
 * - TicketSummaryOutput - The return type for the summarizeTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TicketSummaryInputSchema = z.object({
  ticketContent: z.string().describe('The content of the ticket to summarize.'),
});
export type TicketSummaryInput = z.infer<typeof TicketSummaryInputSchema>;

const TicketSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the ticket content.'),
  keywords: z.string().describe('Comma separated keywords to identify the ticket topic.'),
});
export type TicketSummaryOutput = z.infer<typeof TicketSummaryOutputSchema>;

export async function summarizeTicket(input: TicketSummaryInput): Promise<TicketSummaryOutput> {
  return summarizeTicketFlow(input);
}

const summarizeTicketPrompt = ai.definePrompt({
  name: 'summarizeTicketPrompt',
  input: {schema: TicketSummaryInputSchema},
  output: {schema: TicketSummaryOutputSchema},
  prompt: `You are an AI assistant helping to summarize support tickets for admins.
  Please provide a concise summary of the following ticket content, highlighting the main issue and any relevant details. Also extract keywords which will help with topic identification.

  Ticket Content: {{{ticketContent}}}
  Summary: 
  Keywords:`,
});

const summarizeTicketFlow = ai.defineFlow(
  {
    name: 'summarizeTicketFlow',
    inputSchema: TicketSummaryInputSchema,
    outputSchema: TicketSummaryOutputSchema,
  },
  async input => {
    const {output} = await summarizeTicketPrompt(input);
    return output!;
  }
);
