/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private config: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(dto);
    const saved = this.messageRepository.save(message);

    // Enviar correo
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.transporter.sendMail({
      from: this.config.get('EMAIL_FROM'),
      to: this.config.get('EMAIL_TO'),
      subject: `Nuevo mensaje de ${dto.nombre} - ${dto.servicio}`,
      text: `${dto.nombre} (${dto.email}) escribió:\n\n${dto.mensaje}`,
      html: `<p><b>Nombre:</b> ${dto.nombre}</p>
             <p><b>Email:</b> ${dto.email}</p>
             <p><b>Teléfono:</b> ${dto.telefono || 'N/A'}</p>
             <p><b>Servicio:</b> ${dto.servicio}</p>
             <p>${dto.mensaje}</p>`,
    });

    return saved;
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({ order: { created_at: 'DESC' } });
  }
}
