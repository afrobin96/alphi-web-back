import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiProvider, AiResponse } from './ai-provider.interface';

// Cubre: groq | openai | ollama
// Todos son compatibles con el SDK de OpenAI
@Injectable()
export class OpenAiCompatibleProvider implements AiProvider {
  private client: OpenAI;
  private model: string;

  constructor(private configService: ConfigService) {
    this.model =
      this.configService.get<string>('AI_MODEL')?.toString() ?? 'gpt-4';
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('AI_API_KEY') || '',
      baseURL: this.configService.get<string>('AI_BASE_URL'),
    });
  }

  async generate(prompt: string): Promise<AiResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      content: response.choices[0].message.content ?? '',
      tokensUsed:
        (response.usage?.prompt_tokens ?? 0) +
        (response.usage?.completion_tokens ?? 0),
    };
  }
}
