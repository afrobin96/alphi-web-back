import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/user.entity';

@ApiTags('superadmin')
@ApiBearerAuth('access-token')
@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperadminController {
  // Endpoint de verificación; se reemplaza en la Fase 5
  @Get('ping')
  @ApiOperation({ summary: 'Verifica acceso de superadmin' })
  ping() {
    return { ok: true, scope: 'superadmin' };
  }
}
