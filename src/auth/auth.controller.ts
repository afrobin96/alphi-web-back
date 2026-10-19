import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from './user.entity';
import { Roles } from './decorators/roles.decorator';
import { UpgradePlanDto } from './dto/upgradePlan.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  @Post('login')
  @ApiOperation({ summary: 'Login — devuelve el JWT' })
  @ApiBody({ schema: { example: { username: 'admin', password: 'admin' } } })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.username, body.password);
  }

  // POST /auth/admin — solo admin puede crear admins
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear usuario admin (solo admin)' })
  createAdmin(@Body() body: LoginDto) {
    return this.authService.createAdminUser(body.username, body.password);
  }

  // POST /auth/learner — solo admin puede crear learners
  @Post('learner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear usuario learner (solo admin)' })
  @ApiBody({
    schema: {
      example: {
        username: 'learner1',
        password: 'password123',
        plan: 'starter',
      },
    },
  })
  createLearner(@Body() body: CreateLearnerDto) {
    return this.authService.createLearnerUser(
      body.username,
      body.password,
      body.plan,
    );
  }

  // GET /auth/profile — learner y admin pueden ver su perfil
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.LEARNER)
  @ApiOperation({ summary: 'Ver perfil del usuario autenticado' })
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.getProfile(req.user.id);
  }

  // POST /auth/renew-free — learner con plan FREE renueva tokens del mes
  @Post('renew-free')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Renovar tokens mensuales del plan gratuito' })
  @ApiResponse({ status: 200, description: 'Tokens renovados correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'Ya renovaste este mes o no eres plan FREE.',
  })
  renewFree(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.renewFree(req.user.id);
  }

  // POST /auth/upgrade-plan — learner actualiza a plan pago
  @Post('upgrade-plan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LEARNER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Actualizar a plan pago (starter o pro)' })
  @ApiBody({
    schema: { example: { plan: 'starter' } },
  })
  @ApiResponse({ status: 200, description: 'Plan activado correctamente.' })
  upgradePlan(@Body() body: UpgradePlanDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.updateSubscriptionPlan(req.user.id, body.plan!);
  }
}
