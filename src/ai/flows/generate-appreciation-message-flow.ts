'use server';
/**
 * @fileOverview An AI flow to generate a polite thank-you message after a ticket is resolved.
 *
 * - generateAppreciationMessage - A function that creates a thank you message.
 * - GenerateAppreciationMessageInput - The input type for the function.
 * - GenerateAppreciationMessageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAppreciationMessageInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  ticketSubject: z.string().describe('The subject of the resolved ticket.'),
});
export type GenerateAppreciationMessageInput = z.infer<typeof GenerateAppreciationMessageInputSchema>;

const GenerateAppreciationMessageOutputSchema = z.object({
  message: z.string().describe('The generated thank-you message.'),
});
export type GenerateAppreciationMessageOutput = z.infer<typeof GenerateAppreciationMessageOutputSchema>;

export async function generateAppreciationMessage(input: GenerateAppreciationMessageInput): Promise<GenerateAppreciationMessageOutput> {
  return generateAppreciationMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppreciationMessagePrompt',
  input: { schema: GenerateAppreciationMessageInputSchema },
  output: { schema: GenerateAppreciationMessageOutputSchema },
  prompt: `You are a helpful university staff assistant.
  A student has just provided feedback for a resolved support ticket.
  Your task is to generate a polite, brief, and professional thank-you message to the student for their feedback.

  - The student's name is {{studentName}}.
  - The ticket was about: "{{ticketSubject}}".
  
  Do not ask any questions. Simply provide a warm closing message.
  
  Example: "Thank you for your feedback on your ticket, '{{ticketSubject}}'. We appreciate you taking the time to let us know how we did. We now consider this matter resolved. Have a great day, {{studentName}}!"
  `,
});

const generateAppreciationMessageFlow = ai.defineFlow(
  {
    name: 'generateAppreciationMessageFlow',
    inputSchema: GenerateAppreciationMessageInputSchema,
    outputSchema: GenerateAppreciationMessageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
