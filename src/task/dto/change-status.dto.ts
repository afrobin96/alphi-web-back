import { IsIn } from 'class-validator';

export class ChangeStatusDto {
  @IsIn([
    'to_do',
    'in_course',
    'in_review',
    'reopened',
    'completed',
    'payment_pending',
    'paid',
  ])
  status: string;
}
