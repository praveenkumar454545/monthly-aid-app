'use server';
/**
 * @fileOverview A flow to create a Razorpay payment order.
 *
 * - createPaymentOrder - Creates a payment order with Razorpay.
 * - CreatePaymentOrderInput - The input type for the function.
 * - CreatePaymentOrderOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';

const CreatePaymentOrderInputSchema = z.object({
  amount: z.number().describe('The donation amount in the smallest currency unit (e.g., paise for INR).'),
});
export type CreatePaymentOrderInput = z.infer<typeof CreatePaymentOrderInputSchema>;

const CreatePaymentOrderOutputSchema = z.object({
  orderId: z.string().describe('The ID of the payment order created by Razorpay.'),
  amount: z.number().describe('The amount of the order.'),
  currency: z.string().describe('The currency of the order.'),
});
export type CreatePaymentOrderOutput = z.infer<typeof CreatePaymentOrderOutputSchema>;


const createPaymentOrderFlow = ai.defineFlow(
  {
    name: 'createPaymentOrderFlow',
    inputSchema: CreatePaymentOrderInputSchema,
    outputSchema: CreatePaymentOrderOutputSchema,
  },
  async (input) => {
    const { amount } = input;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay API keys are not configured in environment variables.');
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      if (!order) {
        throw new Error('Failed to create Razorpay order.');
      }
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Could not initiate payment. Please try again.');
    }
  }
);

export async function createPaymentOrder(input: CreatePaymentOrderInput): Promise<CreatePaymentOrderOutput> {
  return createPaymentOrderFlow(input);
}
