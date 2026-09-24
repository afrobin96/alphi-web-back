import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiProvider, AiResponse } from './ai-provider.interface';

@Injectable()
export class GeminiProvider implements AiProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(private configService: ConfigService) {
    this.client = new GoogleGenerativeAI(
      this.configService.get<string>('AI_API_KEY') || '',
    );
    this.model =
      this.configService.get<string>('AI_MODEL') ?? 'gemini-1.5-flash';
  }

  async generate(prompt: string): Promise<AiResponse> {
    const model = this.client.getGenerativeModel({ model: this.model });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Gemini devuelve el conteo de tokens en usageMetadata
    const tokensUsed =
      (response.usageMetadata?.promptTokenCount ?? 0) +
      (response.usageMetadata?.candidatesTokenCount ?? 0);

    return { content: text, tokensUsed };
  }
}
