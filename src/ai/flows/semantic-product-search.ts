'use server';

/**
 * @fileOverview Implements semantic product search using Genkit and LLMs.
 *
 * - semanticProductSearch - A function that performs semantic product search.
 * - SemanticProductSearchInput - The input type for the semanticProductSearch function.
 * - SemanticProductSearchOutput - The return type for the semanticProductSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticProductSearchInputSchema = z.object({
  query: z.string().describe('The search query from the user.'),
  products: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).describe('The list of products to search through.'),
});
export type SemanticProductSearchInput = z.infer<typeof SemanticProductSearchInputSchema>;

const SemanticProductSearchOutputSchema = z.array(z.object({
  name: z.string(),
  description: z.string(),
})).describe('The list of products that match the search query.');
export type SemanticProductSearchOutput = z.infer<typeof SemanticProductSearchOutputSchema>;

export async function semanticProductSearch(input: SemanticProductSearchInput): Promise<SemanticProductSearchOutput> {
  return semanticProductSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticProductSearchPrompt',
  input: {schema: SemanticProductSearchInputSchema},
  output: {schema: SemanticProductSearchOutputSchema},
  prompt: `You are an e-commerce search assistant. Given a user query and a list of products, you will return a list of products that match the query.

User query: {{{query}}}

Products:
{{#each products}}
- Name: {{this.name}}, Description: {{this.description}}
{{/each}}

Return the products that match the query.
Output MUST be a JSON array of products, with the 'name' and 'description' fields. Do not include any other text in the response.`, 
});

const semanticProductSearchFlow = ai.defineFlow(
  {
    name: 'semanticProductSearchFlow',
    inputSchema: SemanticProductSearchInputSchema,
    outputSchema: SemanticProductSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
