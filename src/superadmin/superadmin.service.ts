import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan, User, UserRole } from '../auth/user.entity';

@Injectable()
export class SuperadminService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  async getStats() {
    const byRole = await this.users
      .createQueryBuilder('u')
      .select('u.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('u.role')
      .getRawMany<{ role: UserRole; count: string }>();

    const learnersByPlan = await this.users
      .createQueryBuilder('u')
      .select('u.subscriptionPlan', 'plan')
      .addSelect('COUNT(*)', 'count')
      .where('u.role = :role', { role: UserRole.LEARNER })
      .groupBy('u.subscriptionPlan')
      .getRawMany<{ plan: SubscriptionPlan; count: string }>();

    const roles = { superadmin: 0, admin: 0, learner: 0 };
    byRole.forEach((r) => (roles[r.role] = Number(r.count)));

    const plans = { free: 0, starter: 0, pro: 0 };
    learnersByPlan.forEach((p) => (plans[p.plan] = Number(p.count)));

    return {
      totalUsers: roles.superadmin + roles.admin + roles.learner,
      roles,
      learnersByPlan: plans,
    };
  }

  findAllUsers() {
    return this.users.find({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        subscriptionPlan: true,
        subscriptionExpiresAt: true,
        monthlyTokensUsed: true,
        dailyTokensUsed: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
