import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/currentUser.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getSelf(@CurrentUser('id') id: string) {
    return this.usersService.getOne(id, 'id');
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  async updateUser(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete()
  async deleteUser(
    @CurrentUser('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.deleteUser(id, false, res);
  }
}
