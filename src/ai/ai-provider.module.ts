import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AI_PROVIDER } from './ai-provider.interface';
import { OpenAiCompatibleProvider } from './openai-compatible.provider';
import { AnthropicProvider } from './anthropic.provider';
import { GeminiProvider } from './gemini.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    OpenAiCompatibleProvider,
    AnthropicProvider,
    GeminiProvider,
    {
      provide: AI_PROVIDER,
      inject: [
        ConfigService,
        OpenAiCompatibleProvider,
        AnthropicProvider,
        GeminiProvider,
      ],
      useFactory: (
        config: ConfigService,
        openaiProvider: OpenAiCompatibleProvider,
        anthropicProvider: AnthropicProvider,
        geminiProvider: GeminiProvider,
      ) => {
        const provider = config.get<string>('AI_PROVIDER') ?? 'groq';

        switch (provider) {
          case 'anthropic':
            return anthropicProvider;
          case 'gemini':
            return geminiProvider;
          case 'groq':
          case 'openai':
            return openaiProvider;
          case 'ollama':
          default:
            return openaiProvider;
        }
      },
    },
  ],
  exports: [AI_PROVIDER],
})
export class AiProviderModule {}
