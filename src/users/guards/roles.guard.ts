import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest();

    const user = request.user;
    if (!user) {
      return false;
    }

    const userFromDb = await this.prisma.users.findUnique({
      where: { id: user.id },
    });
    if (!userFromDb) {
      return false;
    }

    // Роль пользователя из базы данных
    const userRole = userFromDb.role;

    // Проверяем наличие требуемых ролей иерархически
    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPER_ADMIN]: 3,
    };

    return requiredRoles.some(
      (role) => roleHierarchy[userRole] >= roleHierarchy[role],
    );
  }
}
