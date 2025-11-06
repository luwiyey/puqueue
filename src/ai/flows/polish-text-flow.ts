'use server';
/**
 * @fileOverview An AI flow to polish user-written text for clarity and professionalism.
 *
 * - polishText - A function that refines a given text.
 * - PolishTextInput - The input type for the polishText function.
 * - PolishTextOutput - The return type for the polishText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PolishTextInputSchema = z.object({
  text: z.string().describe('The user-written text to be polished.'),
});
export type PolishTextInput = z.infer<typeof PolishTextInputSchema>;

const PolishTextOutputSchema = z.object({
  polishedText: z.string().describe('The AI-refined, professional version of the text.'),
});
export type PolishTextOutput = z.infer<typeof PolishTextOutputSchema>;

export async function polishText(input: PolishTextInput): Promise<PolishTextOutput> {
  return polishTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'polishTextPrompt',
  input: { schema: PolishTextInputSchema },
  output: { schema: PolishTextOutputSchema },
  prompt: `You are an expert editor for professional communication.
  A university student has drafted the following message to be sent to university staff.
  Your task is to revise the text to make it more polite, professional, and clear, while preserving the original meaning.
  Do not add any preamble or explanation, just provide the revised text.

  Original text:
  "{{text}}"
  `,
});

const polishTextFlow = ai.defineFlow(
  {
    name: 'polishTextFlow',
    inputSchema: PolishTextInputSchema,
    outputSchema: PolishTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
