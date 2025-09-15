import { SetMetadata } from '@nestjs/common';
import { Role as UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Role = (roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
