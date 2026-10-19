import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);
      const response = await llmClient.generateText({
         model: 'openai/gpt-oss-120b',
         messages: [
            {
               role: 'system',
               content: prompt,
            },
         ],
         maxTokens: 500,
         temperature: 0.2,
      });

      const summary = response ?? 'Unable to generate summary.';

      await reviewRepository.storeReviewSumary(productId, summary);

      return summary;
   },
};
