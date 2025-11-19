import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsEmail()
  email: string;

  @IsOptional()
  teamId?: number;
}
