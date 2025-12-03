import { IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  projectId: number;

  @IsNumber()
  memberId: number;

  note?: string;
}
