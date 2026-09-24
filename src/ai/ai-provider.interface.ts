export interface AiResponse {
  content: string;
  tokensUsed: number;
}

export interface AiProvider {
  generate(prompt: string): Promise<AiResponse>;
}

export const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // Valor por defecto si no se establece la variable de entorno
