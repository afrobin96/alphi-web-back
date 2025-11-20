import { IsNumber } from 'class-validator';

export class AssignTeamDto {
  @IsNumber()
  id: number;
}
