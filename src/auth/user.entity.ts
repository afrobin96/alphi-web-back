import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  LEARNER = 'learner',
}

export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
}

// Límites por plan: { daily, monthly }
export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  { daily: number; monthly: number }
> = {
  [SubscriptionPlan.FREE]: { daily: 200, monthly: 3_000 },
  [SubscriptionPlan.STARTER]: { daily: 1_000, monthly: 20_000 },
  [SubscriptionPlan.PRO]: { daily: 3_000, monthly: 80_000 },
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  subscriptionPlan: SubscriptionPlan | undefined;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date | null | undefined;

  // Tokens consumidos en el mes actual
  @Column({ default: 0 })
  monthlyTokensUsed!: number;

  // Fecha de inicio del período mensual actual
  @Column({ type: 'timestamp', nullable: true })
  monthlyPeriodStart!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
