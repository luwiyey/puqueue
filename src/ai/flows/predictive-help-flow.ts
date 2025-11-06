'use server';
/**
 * @fileOverview An AI flow to predict a user's issue and suggest a solution before they create a ticket.
 *
 * - predictiveHelp - A function that suggests a solution based on ticket content.
 * - PredictiveHelpInput - The input type for the predictiveHelp function.
 * - PredictiveHelpOutput - The return type for the predictiveHelp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PredictiveHelpInputSchema = z.object({
  title: z.string().describe('The title or subject of the support ticket draft.'),
  description: z.string().describe('The detailed description of the support ticket draft.'),
});
export type PredictiveHelpInput = z.infer<typeof PredictiveHelpInputSchema>;

const PredictiveHelpOutputSchema = z.object({
  suggestion: z.string().describe('A likely solution or a link to a relevant form/page. If no suggestion is available, state that the user should proceed with creating the ticket.'),
});
export type PredictiveHelpOutput = z.infer<typeof PredictiveHelpOutputSchema>;

export async function predictiveHelp(input: PredictiveHelpInput): Promise<PredictiveHelpOutput> {
  return predictiveHelpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveHelpPrompt',
  input: { schema: PredictiveHelpInputSchema },
  output: { schema: PredictiveHelpOutputSchema },
  prompt: `You are an AI assistant for a university help desk.
  A user is drafting a support ticket. Based on the title and description, predict the issue and provide a direct, actionable suggestion that might solve their problem without them needing to submit the ticket.

  Potential issues and their solutions:
  - "Good Moral Certificate": The user needs to fill out the 'Good Moral Request Form' available from the Dean's Office.
  - "Transcript of Records (TOR)" or "CAV": The user should submit a request to the Registrar's Office.
  - "Password Reset" or "Can't log in": The user should visit the IT Self-Service Portal to reset their password.
  - "ID Replacement" or "Lost ID": The user needs to go to the Student Affairs office to process an ID replacement.
  - "Tuition Payment" or "Balance Inquiry": The user should contact the Finance Department or check the online payment portal.

  If the issue matches one of the above, provide the corresponding solution.
  If the issue does not clearly match, suggest they proceed with submitting their ticket.

  Ticket Title: "{{title}}"
  Ticket Description: "{{description}}"
  `,
});

const predictiveHelpFlow = ai.defineFlow(
  {
    name: 'predictiveHelpFlow',
    inputSchema: PredictiveHelpInputSchema,
    outputSchema: PredictiveHelpOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
