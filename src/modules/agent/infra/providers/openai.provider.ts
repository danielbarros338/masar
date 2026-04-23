import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IAiProvider } from '../../application/ports/i-ai-provider';

@Injectable()
export class OpenaiProvider extends IAiProvider {
  readonly providerName = 'openai';
  private readonly client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      baseURL: process.env.OPENAI_BASE_URL,
    });
  }

  async complete(
    prompt: string,
    modelId: string,
    systemPrompt?: string,
  ): Promise<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const completion = await this.client.chat.completions.create({
      model: modelId,
      messages,
    });

    return completion.choices[0]?.message?.content ?? '';
  }

  async listModels(): Promise<string[]> {
    const page = await this.client.models.list();
    return page.data.map((model) => model.id);
  }
}
