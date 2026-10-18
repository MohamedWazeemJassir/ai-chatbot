import OpenAI from 'openai';

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1',
});

export type Message = {
   role: 'system' | 'user' | 'assistant';
   content: string;
};
type GenerateTextOptions = {
   model?: string;
   messages: Message[];
   temperature?: number;
   maxTokens?: number;
};

export const llmClient = {
   async generateText({
      model = 'openai/gpt-oss-120b',
      messages,
      temperature = 0.2,
      maxTokens = 300,
   }: GenerateTextOptions) {
      const response = await client.chat.completions.create({
         model,
         messages,
         temperature,
         max_tokens: maxTokens,
      });

      return response.choices[0]?.message.content;
   },
};
