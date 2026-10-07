import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1',
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello World!' });
});

const conversations = new Map<
   string,
   Array<{
      role: 'user' | 'assistant';
      content: string;
   }>
>();

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt, id } = req.body;
   const messages = conversations.get(id) || [];

   messages.push({
      role: 'user',
      content: prompt,
   });

   const response = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages,
      max_tokens: 100,
      temperature: 0.2,
   });
   const assistantMessage = response.choices[0]?.message.content || '';

   messages.push({
      role: 'assistant',
      content: assistantMessage,
   });

   conversations.set(id, messages);

   res.json({ message: response.choices[0]?.message.content });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
