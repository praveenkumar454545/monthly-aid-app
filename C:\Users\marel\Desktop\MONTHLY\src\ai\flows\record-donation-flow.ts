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
import {
  collection,
  doc,
  runTransaction,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import { recordAnonymousDonationInFirestore } from '@/lib/firebase-service';

const DONORS_COLLECTION = 'donors';

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

async function recordDonationInFirestore(input: RecordDonationInput): Promise<RecordDonationOutput> {
  const donorDocRef = doc(db, DONORS_COLLECTION, input.userId);
  const now = new Date();

  const donationData = {
    amount: input.amount,
    createdAt: now.toISOString(),
    ...(input.beneficiaryId && {beneficiaryId: input.beneficiaryId}),
  };

  try {
    // First, update the monthly total. This is for all donations.
    await recordAnonymousDonationInFirestore({ amount: input.amount });

    // Then, update the specific donor's record in a transaction.
    await runTransaction(db, async (transaction) => {
      const donorDoc = await transaction.get(donorDocRef);
      
      if (!donorDoc.exists()) {
        // New donor, create a new document
        const newDonorData = {
          name: input.name,
          phone: input.phone,
          createdAt: now.toISOString(),
          totalDonated: input.amount,
          donations: [donationData],
          isFeatured: false,
          userId: input.userId,
        };
        transaction.set(donorDocRef, newDonorData);
      } else {
        // Existing donor, update their document
        const currentData = donorDoc.data();
        const newDonations = [...(currentData.donations || []), donationData];
        const newTotalDonated = (currentData.totalDonated || 0) + input.amount;

        transaction.update(donorDocRef, { 
          donations: newDonations,
          totalDonated: newTotalDonated,
          name: input.name // Always update the name to the latest provided one
        });
      }
    });

    return {
      donorId: input.userId,
      message: `Thank you, ${input.name}! Your donation of ₹${input.amount} has been successfully recorded.`,
    };

  } catch (error) {
    console.error('Error recording donation in Firestore: ', error);
    // In a real app, you might want to throw a more specific error
    throw new Error('Failed to record donation due to a database error.');
  }
}

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
