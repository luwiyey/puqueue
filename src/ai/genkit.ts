import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Make the AI model modular by using an environment variable.
// This allows developers to easily switch models for testing or production.
const modelName = process.env.GENKIT_MODEL || 'googleai/gemini-2.5-flash';

export const ai = genkit({
  plugins: [googleAI()],
  model: modelName,
});
