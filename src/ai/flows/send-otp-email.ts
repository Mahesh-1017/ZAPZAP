'use server';

/**
 * @fileOverview A flow to simulate sending an OTP email.
 *
 * - sendOtpEmail - A function that handles sending the OTP.
 * - SendOtpEmailInput - The input type for the sendOtpEmail function.
 * - SendOtpEmailOutput - The return type for the sendOtpEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SendOtpEmailInputSchema = z.object({
  email: z.string().describe('The email address to send the OTP to.'),
  otp: z.string().describe('The one-time password.'),
});
export type SendOtpEmailInput = z.infer<typeof SendOtpEmailInputSchema>;

const SendOtpEmailOutputSchema = z.object({
  success: z.boolean(),
});
export type SendOtpEmailOutput = z.infer<typeof SendOtpEmailOutputSchema>;

export async function sendOtpEmail(input: SendOtpEmailInput): Promise<SendOtpEmailOutput> {
  return sendOtpEmailFlow(input);
}

const sendOtpEmailFlow = ai.defineFlow(
  {
    name: 'sendOtpEmailFlow',
    inputSchema: SendOtpEmailInputSchema,
    outputSchema: SendOtpEmailOutputSchema,
  },
  async (input) => {
    // This is a simulation. In a real app, you would use an email service
    // like SendGrid, Mailgun, or AWS SES to send the email.
    console.log(`Sending OTP ${input.otp} to ${input.email}`);

    // For the purpose of this prototype, we'll just assume it was successful.
    return { success: true };
  }
);
