'use server';
/**
 * @fileOverview An AI flow to categorize a student's support ticket into the correct department
 * and, if applicable, identify the specific document type for the Registrar's office.
 *
 * - categorizeTicket - A function that suggests a department and document type based on ticket content.
 * - CategorizeTicketInput - The input type for the categorizeTicket function.
 * - CategorizeTicketOutput - The return type for the categorizeTicket function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeTicketInputSchema = z.object({
  title: z.string().describe('The title or subject of the support ticket.'),
  description: z.string().describe('The detailed description of the support ticket.'),
});
export type CategorizeTicketInput = z.infer<typeof CategorizeTicketInputSchema>;

const CategorizeTicketOutputSchema = z.object({
  department: z.string().describe("The suggested department for the ticket. Must be one of: CSS, Registrar, Guidance, Dean's Office, Finance, IT Support, Library."),
  reasoning: z.string().describe("A brief explanation for why the department was chosen, mentioning the key term. E.g., 'Based on the keyword 'tuition'."),
  documentType: z.enum(['TOR', 'COR', 'CAV', 'Good Moral', 'Other']).optional().describe("If the department is 'Registrar', specify the document type. Otherwise, this can be omitted.")
});
export type CategorizeTicketOutput = z.infer<typeof CategorizeTicketOutputSchema>;

export async function categorizeTicket(input: CategorizeTicketInput): Promise<CategorizeTicketOutput> {
  return categorizeTicketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTicketPrompt',
  input: { schema: CategorizeTicketInputSchema },
  output: { schema: CategorizeTicketOutputSchema },
  prompt: `You are an expert at routing student support tickets to the correct university department.
  Based on the ticket title and description, choose the single most appropriate department from the following list:

  CSS, Registrar, Guidance, Dean's Office, Finance, IT Support, Library

  Analyze the text and provide your reasoning based on the most influential keyword you found.

  **IF AND ONLY IF** the most appropriate department is 'Registrar', you MUST also determine the specific document being requested. The possible document types are:
  - TOR (Transcript of Records)
  - COR (Certificate of Registration)
  - CAV (Certification, Authentication, Verification)
  - Good Moral (Good Moral Certificate)
  - Other (If the request is for the registrar but doesn't fit the above categories)
  
  Set the 'documentType' field accordingly. For all other departments, omit the 'documentType' field.

  Ticket Title: {{{title}}}
  Ticket Description: {{{description}}}
  `,
});

const categorizeTicketFlow = ai.defineFlow(
  {
    name: 'categorizeTicketFlow',
    inputSchema: CategorizeTicketInputSchema,
    outputSchema: CategorizeTicketOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
