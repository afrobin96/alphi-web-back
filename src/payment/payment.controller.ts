import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('payment')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  list() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Post(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.paymentService.changeStatus(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.remove(id);
  }

  @Get('calc')
  calc(
    @Query('projectId') projectId: string,
    @Query('memberId') memberId: string,
  ) {
    return this.paymentService.calculateAmount(
      Number(projectId),
      Number(memberId),
    );
  }

  @Get('project/:id/members')
  projectMembers(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.getMembersForProject(id);
  }
}
