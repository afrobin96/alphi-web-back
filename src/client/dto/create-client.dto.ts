import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;
}
