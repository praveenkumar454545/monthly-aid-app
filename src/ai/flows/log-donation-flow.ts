'use server';
/**
 * @fileOverview A flow to log a donation.
 *
 * - logDonation - A function that logs a donation.
 * - LogDonationInput - The input type for the function.
 * - LogDonationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { logDonationInFirestore } from '@/lib/firebase-service';


const LogDonationInputSchema = z.object({
  name: z.string().describe('The name of the donor.'),
  phone: z.string().describe('The phone number of the donor.'),
  amount: z.number().describe('The amount of the donation.'),
  beneficiaryId: z.union([z.string(), z.number()]).optional().describe('The ID of the beneficiary receiving the donation.'),
});
export type LogDonationInput = z.infer<typeof LogDonationInputSchema>;

const LogDonationOutputSchema = z.object({
  donationId: z.string().describe('The ID of the new donation document.'),
  message: z.string().describe('A confirmation message.'),
});
export type LogDonationOutput = z.infer<typeof LogDonationOutputSchema>;


const logDonationFlow = ai.defineFlow(
  {
    name: 'logDonationFlow',
    inputSchema: LogDonationInputSchema,
    outputSchema: LogDonationOutputSchema,
  },
  async input => {
    // The database logic is handled in the dedicated service
    return await logDonationInFirestore(input);
  }
);

export async function logDonation(input: LogDonationInput): Promise<LogDonationOutput> {
    return logDonationFlow(input);
}
