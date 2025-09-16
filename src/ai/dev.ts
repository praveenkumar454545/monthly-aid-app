import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-beneficiary-stories.ts';
import '@/ai/flows/record-donation-flow.ts';
import '@/ai/flows/record-anonymous-donation-flow.ts';
