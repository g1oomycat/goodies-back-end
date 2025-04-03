import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { hash } from 'argon2';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { IParamsSort } from 'src/common/types/sort';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { PrismaService } from 'src/prisma.service';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ISortUsers } from './types/sort';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async getOne(
    uniqValue: string,
    identifier: 'id' | 'email' = 'id',
    includeStatus: boolean = true,
    returnWithPassword: boolean = false,
    adminRole?: UserRole,
  ) {
    const user = await this.prisma.users.findFirst({
      where: { [identifier]: uniqValue },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');
    // Если нужнен пароль, просто возвращаем без деструктуризации
    if (returnWithPassword) {
      return user;
    }

    // Удаляем только ненужные поля
    const { password, ...userWithoutPasswordAndRole } = user;

    return userWithoutPasswordAndRole;
  }

  async getAll(
    userId?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    role?: UserRole,
    sortBy?: ISortUsers,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
    adminRole?: UserRole,
  ) {
    if (adminRole && role) {
      this.validateRole(role, adminRole);
    }
    const where: Prisma.UsersWhereInput = {
      ...(userId ? { id: userId } : {}),
      ...(role ? { role } : {}),
      ...(adminRole !== UserRole.SUPER_ADMIN && !role
        ? { role: UserRole.USER }
        : {}),
      ...(email ? { name: { contains: email, mode: 'insensitive' } } : {}),
      ...(firstName
        ? { name: { contains: firstName, mode: 'insensitive' } }
        : {}),
      ...(lastName
        ? { name: { contains: lastName, mode: 'insensitive' } }
        : {}),
      ...(phone ? { name: { contains: phone, mode: 'insensitive' } } : {}),
    };
    const orderBy = sortBy ? { [sortBy]: sort } : {};
    const users = await this.prisma.users.findMany({
      where,
      orderBy,
      ...GetSkipAndPage(page, limit),
    });

    const usersList = [];

    users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      usersList.push(userWithoutPassword);
    });
    const totalCount = await this.prisma.users.count({ where });
    return {
      page,
      limit,
      totalCount,
      resultCount: usersList.length,
      result: usersList,
    };
  }

  async create(dto: CreateUserDto) {
    const isUser = await this.checkUser(dto.email, 'email');
    if (isUser) throw new BadRequestException('Пользователь уже существует');

    const user = await this.prisma.users.create({
      data: { ...dto, password: await hash(dto.password) },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async createByAdmin(dto: CreateUserByAdminDto, adminRole: UserRole) {
    const isUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (isUser) throw new BadRequestException('Пользователь уже существует');

    this.validateRole(dto.role, adminRole);

    const user = await this.prisma.users.create({
      data: { ...dto, password: await hash(dto.password) },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    id: string,
    dto: UpdateUserDto | UpdateUserByAdminDto,
    adminRole?: UserRole,
  ) {
    const currentUser = await this.getOne(id, 'id');
    // Проверка прав пользователя при админском обновлении
    if (dto instanceof UpdateUserByAdminDto && adminRole) {
      console.log(adminRole);

      this.validateRole(currentUser.role, adminRole);
      if (dto.password) {
        dto.password = await hash(dto.password);
      }
    }

    const { password, role, ...user } = await this.prisma.users.update({
      where: {
        id,
      },
      data: dto,
    });

    return dto instanceof UpdateUserByAdminDto ? { ...user, role } : user;
  }

  async deleteUser(
    id: string,
    isAdmin: boolean,
    res?: Response,
    adminRole?: UserRole,
  ) {
    const currentUser = await this.getOne(id, 'id', false);
    if (isAdmin && adminRole) {
      this.validateRole(currentUser.role, adminRole);
    }
    if (!isAdmin && res) {
      this.authService.removeRefreshTokenToResponse(res);
    }

    return this.prisma.users.delete({
      where: { id },
    });
  }
  async deleteBulk({ ids }: DeleteBulkDto, adminRole: UserRole) {
    // Получаем изображения до удаления
    const usersRole = await this.prisma.users.findMany({
      where: { id: { in: ids } },
      select: { role: true },
    });

    if (usersRole.length !== ids.length) {
      throw new NotFoundException('Некоторые пользователи не найдены');
    }
    usersRole.forEach((el) => this.validateRole(el.role, adminRole));
    // Потом удаляем
    return this.prisma.products.deleteMany({
      where: { id: { in: ids } },
    });
  }

  private validateRole(targetRole: UserRole, adminRole: UserRole) {
    if (adminRole === UserRole.SUPER_ADMIN) {
      return; // Суперадмин может менять любые роли
    }
    if (adminRole === UserRole.ADMIN && targetRole === UserRole.USER) {
      return; // Админ может менять только юзеров
    }
    throw new ForbiddenException('Недостаточно прав');
  }

  async checkUser(uniqValue: string, identifier: 'id' | 'email') {
    return this.prisma.users.findFirst({
      where: {
        [identifier]: uniqValue,
      },
    });
  }
}
