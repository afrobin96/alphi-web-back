import { IsNumber } from 'class-validator';

export class AssignProjectDto {
  @IsNumber()
  projectId: number;
}
