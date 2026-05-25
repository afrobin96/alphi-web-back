import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { CreateInstructionalDto } from './dto/create-instructional.dto';
import * as aiProviderInterface from 'src/ai/ai-provider.interface';

@Injectable()
export class InstructionalDesignerService {
  constructor(
    @Inject(aiProviderInterface.AI_PROVIDER)
    private readonly aiProvider: aiProviderInterface.AiProvider,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // Generación principal.
  async generate(dto: CreateInstructionalDto, user: User): Promise<string> {
    const prompt = this.buildPrompt(dto);

    let result: { content: string; tokensUsed: number };
    try {
      result = await this.aiProvider.generate(prompt);
    } catch {
      throw new InternalServerErrorException(
        'Error al conectar con la IA. Intenta de nuevo.',
      );
    }

    await this.deductTokens(user, result.tokensUsed);

    return result.content;
  }

  // Descuento real de tokens.
  private async deductTokens(user: User, tokens: number): Promise<void> {
    // Redis — tokens del día con TTL hasta medianoche
    const dailyKey = `tokens:daily:${user.id}`;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ttl = Math.floor((midnight.getTime() - now.getTime()) / 1000);

    const pipeline = this.redis.pipeline();
    pipeline.incrby(dailyKey, tokens);
    pipeline.expire(dailyKey, ttl);
    await pipeline.exec();

    // Postgres — tokens mensuales
    await this.userRepository.increment(
      { id: user.id },
      'monthlyTokensUsed',
      tokens,
    );
  }

  // Prompt instruccional.
  private buildPrompt(dto: CreateInstructionalDto): string {
    return `
      Eres un diseñador instruccional experto con amplia experiencia creando cursos para
      plataformas e-learning como Moodle, Teachable y Coursera.

      PARÁMETROS DEL CURSO:
      - Tema: ${dto.topic}
      - Nivel educativo: ${dto.educationLevel}
      - Público objetivo: ${dto.targetAudience}
      - Área de conocimiento: ${dto.knowledgeArea}

      Genera un plan de curso completo con la siguiente estructura EXACTA:

      # ${dto.topic}

      ## 1. DESCRIPCIÓN DEL CURSO
      Introducción motivadora de 2-3 párrafos.

      ### Competencias a desarrollar
      Lista las 4-5 competencias principales.

      ### Prerrequisitos sugeridos
      Lista los conocimientos previos recomendados.

      ## 2. OBJETIVOS DE APRENDIZAJE
      5 objetivos usando la taxonomía de Bloom con verbos accionables.

      ## 3. ESTRUCTURA DEL CURSO

      ### Módulo 1: [Título]
      **Descripción:** ...
      **Contenido clave:** subtema 1, subtema 2, subtema 3
      **Duración estimada:** X horas

      #### Actividades para e-learning:
      - **Comprensión:** [quiz, foro de reflexión, etc.]
      - **Práctica:** [caso de estudio, simulación, proyecto corto]
      - **Recurso recomendado:** [video / infografía / lectura / podcast]

      ### Módulo 2: [Título]
      [Misma estructura]

      ### Módulo 3: [Título]
      [Misma estructura]

      ## 4. EVALUACIÓN

      ### Evaluación formativa
      2-3 estrategias de evaluación continua.

      ### Evaluación sumativa
      Proyecto o examen final.

      ### Rúbrica simplificada
      3-4 criterios con nivel básico, intermedio y avanzado.

      ## 5. RECOMENDACIONES PARA LA PLATAFORMA E-LEARNING
      3-5 recomendaciones específicas sobre implementación digital.

      ---
      Responde completamente en español. Usa el formato Markdown indicado. Sé específico y práctico.
    `.trim();
  }
}
