import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: 201, description: 'Mensaje creado y correo enviado' })
  async create(@Body() dto: CreateMessageDto): Promise<Message> {
    return this.contactService.createMessage(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los mensajes' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes obtenida' })
  async findAll(): Promise<Message[]> {
    return this.contactService.findAll();
  }
}
