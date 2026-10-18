import { type Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';
import OpenAI from 'openai';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = `
        Summarize the following customer reviews into a short paragraph 
        highlighting key themes, both positive and negative:

        ${joinedReviews}
      `;
      const response = await client.chat.completions.create({
         model: 'openai/gpt-oss-120b',
         messages: [
            {
               role: 'system',
               content: prompt,
            },
         ],
         max_tokens: 500,
         temperature: 0.2,
      });

      return (
         response.choices[0]?.message.content ?? 'Unable to generate summary.'
      );
   },
};

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1',
});
