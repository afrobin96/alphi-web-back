import { IsNumber, IsOptional } from 'class-validator';

export class AssignMemberDto {
  @IsOptional()
  @IsNumber()
  memberId?: number | null;
}
