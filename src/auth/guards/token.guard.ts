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

// El descuento real ocurre DESPUÉS con los tokens reportados por la ia usada
const ESTIMATED_COST = 800;

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user: User = context.switchToHttp().getRequest().user;

    // Verificar suscripción vigente
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

    const limits = PLAN_LIMITS[user.subscriptionPlan];
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Resetear tokens diarios si cambió el día
    if (user.dailyPeriodDate !== today) {
      await this.userRepository.update(user.id, {
        dailyTokensUsed: 0,
        dailyPeriodDate: today,
      });
      user.dailyTokensUsed = 0;
    }

    // Verificar límite diario
    if (user.dailyTokensUsed + ESTIMATED_COST > limits.daily) {
      throw new HttpException(
        {
          message: `Alcanzaste el límite diario de ${limits.daily} tokens. Vuelve mañana o mejora tu plan.`,
          code: 'DAILY_LIMIT_REACHED',
          dailyUsed: user.dailyTokensUsed,
          dailyLimit: limits.daily,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Resetear tokens mensuales si cambió el mes
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
    // Verificar límite mensual
    if (user.monthlyTokensUsed + ESTIMATED_COST > limits.monthly) {
      throw new HttpException(
        {
          message: `Alcanzaste el límite mensual de ${limits.monthly} tokens.`,
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
