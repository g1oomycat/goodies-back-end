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
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';

import { CreatePromotionDto } from './dto/promotion-products/create-promotion.dto';
import { UpdatePromotionDto } from './dto/promotion/update-promotion-products.dto';
import { PromotionsService } from './promotions.service';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UsePipes(new ValidationPipe())
@Auth()
@Controller('admin/promotions')
export class AdminPromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.promotionsService.getOne(id, 'id');
  }

  @HttpCode(200)
  @Post()
  async create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @HttpCode(200)
  @Put(':id')
  async update(@Body() dto: UpdatePromotionDto, @Param('id') id: string) {
    return this.promotionsService.update(dto, id);
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.promotionsService.delete(id);
  }
}
