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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category/create.dto';
import { UpdateCategoryDto } from './dto/category/update.dto';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Auth()
@UsePipes(new ValidationPipe()) // Включает валидацию для всех методов
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.categoriesService.getOne(id, 'id');
  }

  @HttpCode(200)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @HttpCode(200)
  @Put(':id')
  async update(@Body() dto: UpdateCategoryDto, @Param('id') id: string) {
    return this.categoriesService.update(dto, id);
  }
  @HttpCode(200)
  @Delete('bulk')
  async deleteBulk(@Body() dto: DeleteBulkDto) {
    return this.categoriesService.deleteBulk(dto);
  }
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
