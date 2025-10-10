import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() dto: CreateMessageDto): Promise<Message> {
    return this.contactService.createMessage(dto);
  }

  @Get()
  async findAll(): Promise<Message[]> {
    return this.contactService.findAll();
  }
}
