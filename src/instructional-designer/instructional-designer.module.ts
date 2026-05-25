import { Module } from '@nestjs/common';
import { InstructionalDesignerService } from './instructional-designer.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { InstructionalDesignerController } from './instructional-designer.controller';
import { PdfService } from 'src/pdf/pdf.service';
import { TokenGuard } from 'src/auth/guards/token.guard';
import { AiProviderModule } from 'src/ai/ai-provider.module';

@Module({
  imports: [ConfigModule, AuthModule, AiProviderModule],
  controllers: [InstructionalDesignerController],
  providers: [InstructionalDesignerService, PdfService, TokenGuard],
})
export class InstructionalDesignerModule {}
