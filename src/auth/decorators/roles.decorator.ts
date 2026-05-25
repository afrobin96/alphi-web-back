import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../user.entity';

export const ROLES_KEY = 'roles';

// Uso: @Roles(UserRole.ADMIN) o @Roles(UserRole.LEARNER)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
