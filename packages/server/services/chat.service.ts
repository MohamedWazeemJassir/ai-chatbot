import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1',
});

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const previousMessages =
         conversationRepository.getMessages(conversationId);

      const messages = [
         {
            role: 'system' as const,
            content: instructions,
         },
         ...previousMessages,
         {
            role: 'user' as const,
            content: prompt,
         },
      ];

      const response = await client.chat.completions.create({
         model: 'openai/gpt-oss-120b',
         messages,
         max_tokens: 200,
         temperature: 0.2,
      });

      const assistantMessage = response.choices[0]?.message.content || '';

      conversationRepository.addMessage(conversationId, {
         role: 'user',
         content: prompt,
      });

      conversationRepository.addMessage(conversationId, {
         role: 'assistant',
         content: assistantMessage,
      });

      return {
         id: response.id,
         message: assistantMessage,
      };
   },
};
