'use server';
/**
 * @fileOverview An AI flow to generate professional reply templates for support tickets.
 *
 * - generateReplyTemplates - A function that suggests reply templates.
 * - GenerateReplyInput - The input type for the function.
 * - GenerateReplyOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateReplyInputSchema = z.object({
  subject: z.string().describe('The subject of the support ticket.'),
  description: z.string().describe('The detailed description from the student.'),
  studentName: z.string().optional().describe("The student's name, if available."),
});
export type GenerateReplyInput = z.infer<typeof GenerateReplyInputSchema>;

const ReplyTemplateSchema = z.object({
  title: z.string().describe('A short, descriptive title for the reply, e.g., "Acknowledge & Escalate".'),
  content: z.string().describe('The full, professional reply text.'),
});

const GenerateReplyOutputSchema = z.object({
  templates: z.array(ReplyTemplateSchema).length(3).describe('An array of exactly three distinct reply templates.'),
});
export type GenerateReplyOutput = z.infer<typeof GenerateReplyOutputSchema>;

export async function generateReplyTemplates(input: GenerateReplyInput): Promise<GenerateReplyOutput> {
  return generateReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReplyPrompt',
  input: { schema: GenerateReplyInputSchema },
  output: { schema: GenerateReplyOutputSchema },
  prompt: `You are a helpful assistant for university staff.
  A student named {{#if studentName}}{{studentName}}{{else}}a student{{/if}} has submitted a support ticket.
  Your task is to generate exactly three distinct, professional reply templates that staff can use to respond.
  Each template should have a clear title and a complete, polite message.

  Ticket Subject: "{{subject}}"
  Ticket Description: "{{description}}"

  Generate three templates with different approaches:
  1.  A direct answer if the solution is obvious.
  2.  A polite message acknowledging the issue and stating that it's being looked into.
  3.  A message that asks for more specific information to better diagnose the problem.
  `,
});

const generateReplyFlow = ai.defineFlow(
  {
    name: 'generateReplyFlow',
    inputSchema: GenerateReplyInputSchema,
    outputSchema: GenerateReplyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
