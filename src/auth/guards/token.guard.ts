/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Estimado conservador antes de llamar a la IA

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAN_LIMITS, SubscriptionPlan, User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

// El descuento real ocurre DESPUÉS con los tokens reportados por la ia usada
const ESTIMATED_COST = 800;

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    // Verificar que el plan no haya expirado si tiene plan de pago
    if (
      user.subscriptionPlan !== SubscriptionPlan.FREE &&
      user.subscriptionExpiresAt &&
      new Date() > user.subscriptionExpiresAt
    ) {
      throw new HttpException(
        {
          message:
            'Tu suscripción ha expirado. Renueva tu plan para continuar.',
          code: 'SUBSCRIPTION_EXPIRED',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const limits = PLAN_LIMITS[user.subscriptionPlan!];

    // Verificar límite DIARIO desde Redis
    const dailyKey = `tokens:daily:${user.id}`;
    const dailyUsedRaw = await this.redis.get(dailyKey);
    const dailyUsed = parseInt(dailyUsedRaw ?? '0', 10);

    if (dailyUsed + ESTIMATED_COST > limits.daily) {
      throw new HttpException(
        {
          message: `Alcanzaste el límite diario de ${limits.daily} tokens. Vuelve mañana o mejora tu plan.`,
          code: 'DAILY_LIMIT_REACHED',
          dailyUsed,
          dailyLimit: limits.daily,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Verificar límite MENSUAL desde Postgres
    // Reiniciar contador si cambió el mes
    const now = new Date();
    const periodStart = user.monthlyPeriodStart
      ? new Date(user.monthlyPeriodStart)
      : null;

    if (!periodStart || now.getMonth() !== periodStart.getMonth()) {
      await this.userRepository.update(user.id, {
        monthlyTokensUsed: 0,
        monthlyPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1),
      });
      user.monthlyTokensUsed = 0;
    }

    if (user.monthlyTokensUsed + ESTIMATED_COST > limits.monthly) {
      throw new HttpException(
        {
          message: `Alcanzaste el límite mensual de ${limits.monthly} tokens. Espera el próximo período o mejora tu plan.`,
          code: 'MONTHLY_LIMIT_REACHED',
          monthlyUsed: user.monthlyTokensUsed,
          monthlyLimit: limits.monthly,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
