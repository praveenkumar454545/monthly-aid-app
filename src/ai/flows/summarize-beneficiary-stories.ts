// SummarizeBeneficiaryStories.ts
'use server';

/**
 * @fileOverview A beneficiary story summarization AI agent.
 *
 * - summarizeBeneficiaryStory - A function that summarizes beneficiary stories.
 * - SummarizeBeneficiaryStoryInput - The input type for the summarizeBeneficiaryStory function.
 * - SummarizeBeneficiaryStoryOutput - The return type for the summarizeBeneficiaryStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const SummarizeBeneficiaryStoryInputSchema = z.object({
  story: z.string().describe('The long story of the beneficiary.'),
});
export type SummarizeBeneficiaryStoryInput = z.infer<typeof SummarizeBeneficiaryStoryInputSchema>;

const SummarizeBeneficiaryStoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the beneficiary story.'),
});
export type SummarizeBeneficiaryStoryOutput = z.infer<typeof SummarizeBeneficiaryStoryOutputSchema>;

export async function summarizeBeneficiaryStory(
  input: SummarizeBeneficiaryStoryInput
): Promise<SummarizeBeneficiaryStoryOutput> {
  return summarizeBeneficiaryStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBeneficiaryStoryPrompt',
  input: {schema: SummarizeBeneficiaryStoryInputSchema},
  output: {schema: SummarizeBeneficiaryStoryOutputSchema},
  prompt: `You are an expert summarizer, able to distill long pieces of text into their key points.

  Please summarize the following beneficiary story in a concise manner:

  {{{story}}}
  `,
});

const summarizeBeneficiaryStoryFlow = ai.defineFlow(
  {
    name: 'summarizeBeneficiaryStoryFlow',
    inputSchema: SummarizeBeneficiaryStoryInputSchema,
    outputSchema: SummarizeBeneficiaryStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
