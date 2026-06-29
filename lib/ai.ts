import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseekProvider = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export const deepseek = (model: string = 'deepseek-chat') =>
  deepseekProvider(model);
