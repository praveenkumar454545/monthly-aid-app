'use server';
/**
 * @fileOverview A flow to record a donation from a signed-in user.
 *
 * - recordDonation - A function that records a donation, creating or updating a donor record.
 * - RecordDonationInput - The input type for the recordDonation function.
 * - RecordDonationOutput - The return type for the recordDonation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { recordDonationInFirestore } from '@/lib/firebase-service';

const RecordDonationInputSchema = z.object({
  name: z.string().describe('The name of the donor.'),
  phone: z.string().describe('The phone number of the donor.'),
  amount: z.number().describe('The amount of the donation.'),
  beneficiaryId: z.union([z.string(), z.number()]).optional().describe('The ID of the beneficiary receiving the donation.'),
  userId: z.string().describe('The Firebase Auth user ID of the donor.'),
});
export type RecordDonationInput = z.infer<typeof RecordDonationInputSchema>;

const RecordDonationOutputSchema = z.object({
  donorId: z.string().describe('The ID of the donor record.'),
  message: z.string().describe('A confirmation message.'),
});
export type RecordDonationOutput = z.infer<typeof RecordDonationOutputSchema>;


const recordDonationFlow = ai.defineFlow(
  {
    name: 'recordDonationFlow',
    inputSchema: RecordDonationInputSchema,
    outputSchema: RecordDonationOutputSchema,
  },
  async input => {
    if (!input.userId) {
      throw new Error('User must be authenticated to make a tracked donation.');
    }
    
    return await recordDonationInFirestore(input);
  }
);

export async function recordDonation(input: RecordDonationInput): Promise<RecordDonationOutput> {
    return recordDonationFlow(input);
}
