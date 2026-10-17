type Message = {
   role: 'user' | 'assistant';
   content: string;
};

const conversations = new Map<string, Message[]>();

export const conversationRepository = {
   getMessages(conversationId: string): Message[] {
      return conversations.get(conversationId) || [];
   },

   addMessage(conversationId: string, message: Message) {
      const messages = this.getMessages(conversationId);

      messages.push(message);

      conversations.set(conversationId, messages);
   },
};
