
'use server';

/**
 * @fileoverview This file acts as the central registry for all Genkit AI flows (plugins).
 *
 * To add a new AI capability (a "plugin") to the system:
 * 1. Create a new file in the `src/ai/flows` directory (e.g., `src/ai/flows/new-feature-flow.ts`).
 * 2. Implement your Genkit flow within that file.
 * 3. Import the new flow file here.
 *
 * This simple import mechanism allows for modular and scalable integration of new AI features
 * without modifying the core application logic.
 */

import { config } from 'dotenv';
config();

// --- Core AI Flows ---
import '@/ai/flows/ai-chatbot-support.ts';
import '@/ai/flows/polish-text-flow.ts';
import '@/ai/flows/generate-reply-flow.ts';

// --- Ticket Management Flows ---
import '@/ai/flows/ticket-summary.ts';
import '@/ai/flows/categorize-ticket-flow.ts';
import '@/ai/flows/predictive-help-flow.ts';
import '@/ai/flows/generate-appreciation-message-flow.ts';

// --- Admin & System Flows ---
import '@/ai/flows/admin-train-ai-chatbot.ts';
import '@/ai/flows/admin-assistant-flow.ts';
import '@/ai/flows/handbook-search-flow.ts';
