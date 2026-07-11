'use client';

import ChatbotWidget from '@/components/chatbot/chatbot-widget';

/** Landing-page chatbot (guest, rate-limited). */
export default function ChatPanel() {
  return <ChatbotWidget surface="landing" />;
}
