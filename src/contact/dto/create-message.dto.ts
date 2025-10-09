/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @Length(3, 150)
  nombre: string;

  @IsEmail()
  email: string;

  @IsOptional()
  telefono: string;

  @IsNotEmpty()
  servicio: string;

  @IsNotEmpty()
  @Length(10, 100)
  mensaje: string;
}
