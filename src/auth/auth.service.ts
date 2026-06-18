import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan, User, UserRole } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Valida si el usuario existe y si la contraseña es correcta.
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);

    return match ? user : null;
  }

  // Logeo del usuario.
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) return 'Credenciales invalidas';

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
      },
    };
  }

  // Crear el usuario admin por primera vez si no existe.
  async createAdminUser(username: string, password: string) {
    const existing = await this.userRepository.findOne({ where: { username } });

    if (existing) throw new ConflictException('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role: UserRole.ADMIN,
      subscriptionPlan: SubscriptionPlan.FREE,
    });

    return this.userRepository.save(adminUser);
  }

  // Crear learner role.
  async createLearnerUser(
    username: string,
    password: string,
    plan: SubscriptionPlan = SubscriptionPlan.FREE,
  ) {
    const existing = await this.userRepository.findOne({ where: { username } });

    if (existing !== null && existing !== undefined)
      throw new ConflictException(`El usuario: ${username} ya existe`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date();

    // Si el plan no es FREE, la suscripción dura 30 días
    const subscriptionExpiresAt =
      plan !== SubscriptionPlan.FREE
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        : null;

    const learner = this.userRepository.create({
      username,
      password: hashedPassword,
      role: UserRole.LEARNER,
      subscriptionPlan: plan,
      subscriptionExpiresAt,
      monthlyTokensUsed: 0,
      monthlyPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1),
    });

    return this.userRepository.save(learner);
  }

  // Perfil del usuario logeado.
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      monthlyTokensUsed: user.monthlyTokensUsed,
      createdAt: user.createdAt,
    };
  }

  //  Actualizar plan lo llama el webhook de Stripe después.
  async updateSubscriptionPlan(userId: number, plan: SubscriptionPlan) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const now = new Date();
    user.subscriptionPlan = plan;
    user.subscriptionExpiresAt = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );
    user.monthlyTokensUsed = 0;
    user.monthlyPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.userRepository.save(user);
  }
}
