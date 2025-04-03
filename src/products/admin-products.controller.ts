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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UsePipes(new ValidationPipe())
@Auth()
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.getOne(id, 'id');
  }

  @HttpCode(200)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @HttpCode(200)
  @Put(':id')
  async update(@Body() dto: UpdateProductDto, @Param('id') id: string) {
    console.log(id);

    return this.productsService.update(dto, id);
  }
  @HttpCode(200)
  @Delete('bulk')
  async deleteBulk(@Body() dto: DeleteBulkDto) {
    return this.productsService.deleteBulk(dto);
  }
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
