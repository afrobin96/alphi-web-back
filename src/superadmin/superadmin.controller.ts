import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/user.entity';
import { SuperadminService } from './superadmin.service';

@ApiTags('superadmin')
@ApiBearerAuth('access-token')
@Controller('superadmin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPERADMIN)
export class SuperadminController {
  constructor(private readonly service: SuperadminService) {}

  // Endpoint de verificación; se reemplaza en la Fase 5
  @Get('ping')
  @ApiOperation({ summary: 'Verifica acceso de superadmin' })
  ping() {
    return { ok: true, scope: 'superadmin' };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Conteo de cuentas por rol y de learners por plan' })
  stats() {
    return this.service.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar todas las cuentas' })
  users() {
    return this.service.findAllUsers();
  }
}
