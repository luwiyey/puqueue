
'use server';

/**
 * @fileOverview An AI-powered assistant for administrators to query system data.
 *
 * - adminAssistant - A function that handles admin queries.
 * - AdminAssistantInput - The input type for the adminAssistant function.
 * - AdminAssistantOutput - The return type for the adminAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AdminAssistantInputSchema = z.object({
  query: z.string().describe('The natural language query from the administrator.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The history of the conversation so far.'),
});
export type AdminAssistantInput = z.infer<typeof AdminAssistantInputSchema>;

const AdminAssistantOutputSchema = z.object({
  response: z.string().describe('The answer to the admin\'s query.'),
});
export type AdminAssistantOutput = z.infer<typeof AdminAssistantOutputSchema>;


// Placeholder tool for fetching system metrics.
const getSystemMetrics = ai.defineTool(
    {
        name: 'getSystemMetrics',
        description: 'Retrieves system metrics like ticket counts, user roles, or department performance.',
        inputSchema: z.object({
            metric: z.string().describe("The specific metric to retrieve, e.g., 'slowest_department' or 'counseling_tickets_this_week'"),
        }),
        outputSchema: z.string().describe('The result of the metric query, often in JSON format.'),
    },
    async ({ metric }) => {
        // In a real implementation, this would query Firestore based on the metric.
        // For now, we return a simulated result.
        console.log(`Simulating fetch for metric: ${metric}`);
        if (metric.includes('slowest_department')) {
            return JSON.stringify({ department: 'Registrar', avgResponseTime: '8.2 hours' });
        }
        if (metric.includes('counseling_tickets')) {
            return JSON.stringify({ count: 5 });
        }
        return JSON.stringify({ result: `Data for '${metric}' is not available in this simulation.` });
    }
);


export async function adminAssistant(input: AdminAssistantInput): Promise<AdminAssistantOutput> {
  return adminAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminAssistantPrompt',
  tools: [getSystemMetrics],
  input: { schema: AdminAssistantInputSchema },
  output: { schema: AdminAssistantOutputSchema },
  prompt: `You are an AI assistant for a university administrator with a strict focus on data privacy.
  Your role is to answer questions about the system's data by using the available tools.
  Be concise and professional. If you use a tool, summarize the result in a clear, human-readable sentence.

  **PRIVACY RULE**: You MUST refuse any query that asks for personally identifiable information (PII) about any user, especially anonymous guests or parents. This includes names, emails, phone numbers, or any data that could be used to correlate their activity (e.g., "Show me the feedback from the guest who just booked an appointment").
  If a query violates this rule, you MUST respond with: "I cannot process this request as it violates the privacy policy. I can only provide aggregated, de-identified data."

  {{#if history}}
  This is the conversation history so far:
  {{#each history}}
  {{this.role}}: {{this.content}}
  {{/each}}
  {{/if}}

  Now, address the following query from the administrator: "{{query}}"
  `,
});

const adminAssistantFlow = ai.defineFlow(
  {
    name: 'adminAssistantFlow',
    inputSchema: AdminAssistantInputSchema,
    outputSchema: AdminAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
