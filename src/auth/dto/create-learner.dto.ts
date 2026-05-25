import { SubscriptionPlan } from '../user.entity';

export class CreateLearnerDto {
  username: string | undefined;
  password: string | undefined;
  plan?: SubscriptionPlan;
}
