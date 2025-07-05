'use server';
/**
 * @fileOverview Generates birthday invitation text using AI.
 *
 * - generateInvitationText - A function to generate a title and poem.
 * - GenerateInvitationTextInput - Input for the generation function.
 * - GenerateInvitationTextOutput - Output of the generation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateInvitationTextInputSchema = z.object({
  name: z.string().describe('The name of the person the invitation is for.'),
  style_prompt: z.string().describe('A short prompt describing the desired style of the invitation text. e.g. "magical and elegant", "fun and quirky"'),
});
export type GenerateInvitationTextInput = z.infer<typeof GenerateInvitationTextInputSchema>;

export const GenerateInvitationTextOutputSchema = z.object({
  title: z.string().describe('An elegant and catchy title for the birthday greeting.'),
  poem: z.string().describe('A short, heartfelt poem for the birthday card. It should have line breaks.'),
});
export type GenerateInvitationTextOutput = z.infer<typeof GenerateInvitationTextOutputSchema>;

export async function generateInvitationText(input: GenerateInvitationTextInput): Promise<GenerateInvitationTextOutput> {
  return generateInvitationTextFlow(input);
}

const invitationPrompt = ai.definePrompt({
    name: 'invitationPrompt',
    input: { schema: GenerateInvitationTextInputSchema },
    output: { schema: GenerateInvitationTextOutputSchema },
    prompt: `You are a creative writer specializing in crafting beautiful birthday messages.
    
    Generate a title and a short, heartfelt poem for a birthday invitation for a person named {{{name}}}.
    
    The style should be: {{{style_prompt}}}.
    
    The poem should be around 4-6 lines long and include line breaks for formatting.
    The response must be in the specified JSON format.`,
});

const generateInvitationTextFlow = ai.defineFlow(
  {
    name: 'generateInvitationTextFlow',
    inputSchema: GenerateInvitationTextInputSchema,
    outputSchema: GenerateInvitationTextOutputSchema,
  },
  async (input) => {
    const { output } = await invitationPrompt(input);
    return output!;
  }
);
