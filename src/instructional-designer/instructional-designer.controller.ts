/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateInstructionalDto } from './dto/create-instructional.dto';
import { InstructionalDesignerService } from './instructional-designer.service';
import { PdfService } from 'src/pdf/pdf.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/user.entity';
import { TokenGuard } from 'src/auth/guards/token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('instructional-designer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LEARNER)
@ApiBearerAuth('access-token')
export class InstructionalDesignerController {
  constructor(
    private readonly instructionalDesignerService: InstructionalDesignerService,
    private readonly pdfService: PdfService,
  ) {}

  @Post('generate')
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.OK)
  async generate(
    @Body() dto: CreateInstructionalDto,
    @Request() req,
    @Res() res: Response,
  ) {
    // Llamar a la IA (descuenta tokens reales internamente)
    const markdownContent = await this.instructionalDesignerService.generate(
      dto,
      req.user,
    );

    // Generar el PDF
    const pdfBuffer = await this.pdfService.generatePdf(markdownContent, dto);

    // Enviar el PDF como descarga
    const filename = `diseño-instruccional-${Date.now()}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
