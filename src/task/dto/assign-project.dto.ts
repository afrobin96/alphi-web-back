import { IsNumber, IsOptional } from 'class-validator';

export class AssignProjectDto {
  @IsOptional()
  @IsNumber()
  projectId?: number | null;
}
