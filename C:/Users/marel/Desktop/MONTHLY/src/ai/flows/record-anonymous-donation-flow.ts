'use server';
/**
 * @fileOverview A flow to record an anonymous donation.
 *
 * - recordAnonymousDonation - A function that records an anonymous donation by updating a monthly total.
 * - RecordAnonymousDonationInput - The input type for the function.
 * - RecordAnonymousDonationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { recordAnonymousDonationInFirestore } from '@/lib/firebase-service';


const RecordAnonymousDonationInputSchema = z.object({
  amount: z.number().describe('The amount of the donation.'),
});
export type RecordAnonymousDonationInput = z.infer<typeof RecordAnonymousDonationInputSchema>;

const RecordAnonymousDonationOutputSchema = z.object({
  month: z.string().describe('The month the donation was recorded for.'),
  message: z.string().describe('A confirmation message.'),
});
export type RecordAnonymousDonationOutput = z.infer<typeof RecordAnonymousDonationOutputSchema>;


const recordAnonymousDonationFlow = ai.defineFlow(
  {
    name: 'recordAnonymousDonationFlow',
    inputSchema: RecordAnonymousDonationInputSchema,
    outputSchema: RecordAnonymousDonationOutputSchema,
  },
  async input => {
    // The database logic is now handled in a dedicated service
    return await recordAnonymousDonationInFirestore(input);
  }
);

export async function recordAnonymousDonation(input: RecordAnonymousDonationInput): Promise<RecordAnonymousDonationOutput> {
    return recordAnonymousDonationFlow(input);
}
