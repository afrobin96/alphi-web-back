import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateLearnerDto } from './dto/create-learner.dto';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from './user.entity';
import { Roles } from './decorators/roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.username, body.password);
  }

  // POST /auth/admin — solo admin puede crear admins
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createAdmin(@Body() body: LoginDto) {
    return this.authService.createAdminUser(body.username, body.password);
  }

  // POST /auth/learner — solo admin puede crear learners
  @Post('learner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createLearner(@Body() body: CreateLearnerDto) {
    return this.authService.createLearnerUser(
      body.username!,
      body.password!,
      body.plan,
    );
  }

  // GET /auth/profile — learner y admin pueden ver su perfil
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LEARNER)
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.getProfile(req.user.id);
  }
}
