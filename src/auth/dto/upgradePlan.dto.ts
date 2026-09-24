import { IsEnum } from 'class-validator';
import { SubscriptionPlan } from '../user.entity';

export class UpgradePlanDto {
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;
}
