import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { IParamsSort } from 'src/common/types/sort';
import { CurrentUser } from './decorators/currentUser.decorator';
import { Roles } from './decorators/roles.decorator';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { RolesGuard } from './guards/roles.guard';
import { ISortUsers } from './types/sort';
import { UsersService } from './users.service';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UsePipes(new ValidationPipe())
@Auth()
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(
    @CurrentUser('role') adminRole: UserRole,
    @Query('userId') userId?: string,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('role') role?: UserRole,
    @Query('sortBy')
    sortBy: ISortUsers = 'createdAt',
    @Query('sort') sort: IParamsSort = 'desc',
    @Query('limit') limit: string = '20',
    @Query('page') page: string = '1',
  ) {
    return this.usersService.getAll(
      userId,
      email,
      firstName,
      lastName,
      phone,
      role,
      sortBy,
      sort,
      Number(limit),
      Number(page),
      adminRole,
    );
  }

  @HttpCode(200)
  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @CurrentUser('role') adminRole: UserRole,
  ) {
    return this.usersService.getOne(id, 'id', true, false, adminRole);
  }

  @HttpCode(200)
  @Post()
  async create(
    @Body() dto: CreateUserByAdminDto,
    @CurrentUser('role') adminRole: UserRole,
  ) {
    return this.usersService.createByAdmin(dto, adminRole);
  }

  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser('role') adminRole: UserRole,
    @Body() dto: UpdateUserByAdminDto,
  ) {
    return this.usersService.update(id, dto, adminRole);
  }
  @HttpCode(200)
  @Delete('bulk')
  async deleteBulk(
    @Body() dto: DeleteBulkDto,
    @CurrentUser('role') adminRole: UserRole,
  ) {
    return this.usersService.deleteBulk(dto, adminRole);
  }
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser('role') adminRole: UserRole,
  ) {
    return this.usersService.deleteUser(id, true, undefined, adminRole);
  }
}
