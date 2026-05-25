export interface AiResponse {
  content: string;
  tokensUsed: number;
}

export interface AiProvider {
  generate(prompt: string): Promise<AiResponse>;
}

export const AI_PROVIDER = 'AI_PROVIDER_TOKEN';