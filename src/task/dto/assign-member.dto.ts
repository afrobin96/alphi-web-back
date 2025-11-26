import { IsNumber } from 'class-validator';

export class AssignMemberDto {
  @IsNumber()
  memberId: number;
}
