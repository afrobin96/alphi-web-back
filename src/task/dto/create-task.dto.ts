import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsOptional()
  projectId?: number | null;

  @IsOptional()
  memberId?: number | null;
}
