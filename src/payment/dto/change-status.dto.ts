import { IsIn } from 'class-validator';

export class ChangeStatusDto {
  @IsIn(['pending', 'paid', 'cancelled'])
  status: 'pending' | 'paid' | 'cancelled';
}
