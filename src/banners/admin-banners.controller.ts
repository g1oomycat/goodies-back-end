import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UsePipes(new ValidationPipe())
@Auth()
@Controller('admin/banners')
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.bannersService.getOne(id);
  }

  @HttpCode(200)
  @Post()
  async create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto);
  }

  @HttpCode(200)
  @Put(':id')
  async update(@Body() dto: UpdateBannerDto, @Param('id') id: string) {
    return this.bannersService.update(dto, id);
  }
  @HttpCode(200)
  @Delete('bulk')
  async deleteBulk(@Body() dto: DeleteBulkDto) {
    return this.bannersService.deleteBulk(dto);
  }
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bannersService.delete(id);
  }
}
