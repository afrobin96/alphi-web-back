import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
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

    if (!user) throw new Error('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      acces_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  // Crear el usuario admin por primera vez si no existe.
  async createAdminUser(
    username: string,
    password: string,
    role: string = 'admin',
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(adminUser);
  }
}
