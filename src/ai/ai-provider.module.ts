import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AI_PROVIDER } from './ai-provider.interface';
import { OpenAiCompatibleProvider } from './openai-compatible.provider';
import { AnthropicProvider } from './anthropic.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    OpenAiCompatibleProvider,
    AnthropicProvider,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService, OpenAiCompatibleProvider, AnthropicProvider],
      useFactory: (
        config: ConfigService,
        openaiProvider: OpenAiCompatibleProvider,
        anthropicProvider: AnthropicProvider,
      ) => {
        const provider = config.get<string>('AI_PROVIDER') ?? 'groq';

        switch (provider) {
          case 'anthropic':
            return anthropicProvider;
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
