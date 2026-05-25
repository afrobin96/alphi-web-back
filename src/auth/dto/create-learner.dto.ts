import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlan } from '../user.entity';

export class CreateLearnerDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(SubscriptionPlan)
  @IsOptional()
  plan?: SubscriptionPlan;
}
