/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { AiProvider, AiResponse } from './ai-provider.interface';

@Injectable()
export class AnthropicProvider implements AiProvider {
  private client: Anthropic;
  private model: string;

  constructor(private configService: ConfigService) {
    this.model = this.configService.get<string>('AI_MODEL')!;
    this.client = new Anthropic({
      apiKey: this.configService.get<string>('AI_API_KEY'),
    });
  }

  async generate(prompt: string): Promise<AiResponse> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');

    return {
      content: textBlock?.type === 'text' ? textBlock.text : '',
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    };
  }
}
