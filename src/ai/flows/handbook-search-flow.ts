'use server';
/**
 * @fileOverview An AI flow for searching the student handbook.
 *
 * - handbookSearch - A function that answers questions based on the student handbook.
 * - HandbookSearchInput - The input type for the handbookSearch function.
 * - HandbookSearchOutput - The return type for the handbookSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HandbookSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query from the student.'),
});
export type HandbookSearchInput = z.infer<typeof HandbookSearchInputSchema>;

const HandbookSearchOutputSchema = z.object({
  answer: z.string().describe('A clear and concise answer to the query, based on the student handbook. If the answer is not in the handbook, state that.'),
});
export type HandbookSearchOutput = z.infer<typeof HandbookSearchOutputSchema>;

export async function handbookSearch(input: HandbookSearchInput): Promise<HandbookSearchOutput> {
  return handbookSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handbookSearchPrompt',
  input: { schema: HandbookSearchInputSchema },
  output: { schema: HandbookSearchOutputSchema },
  prompt: `You are an AI assistant designed to answer questions based *only* on the content of the university's student handbook.

  Context from Student Handbook:
  "The university requires a minimum GPA of 2.0 for all students to remain in good academic standing."
  "To request a copy of your Transcript of Records (TOR), submit a request form to the Registrar's office. The processing time is 5-7 business days."
  "Dropping a course after the third week of the semester will result in a 'W' (Withdrawn) grade on the student's transcript."
  "All students are expected to adhere to the university's code of conduct, which prohibits plagiarism and any form of academic dishonesty."
  "To request a 'Good Moral Certificate', a student must be cleared of all academic and financial delinquencies. The request is filed at the Dean's Office."

  Analyze the user's query and provide a direct answer using only the information provided above.
  If the answer cannot be found in the provided context, you MUST state: "I could not find information about that in the student handbook." Do not invent information.

  User Query: "{{query}}"
  `,
});

const handbookSearchFlow = ai.defineFlow(
  {
    name: 'handbookSearchFlow',
    inputSchema: HandbookSearchInputSchema,
    outputSchema: HandbookSearchOutputSchema,
  },
  async (input) => {
    // In a real application, you would use retrieval-augmented generation (RAG)
    // to find relevant sections of the handbook from a vector database (e.g., Firestore Vector Search)
    // and inject them into the prompt's context.
    // For this prototype, we are using a hardcoded context in the prompt.
    
    const { output } = await prompt(input);
    return output!;
  }
);
