import { IsNumber } from 'class-validator';

export class AssignDto {
  @IsNumber()
  id: number;
}
