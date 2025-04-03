import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';

import { DeletePromotionProductsDto } from './dto/promotion-products/delete-promotion.dto';
import { CreatePromotionProductsDto } from './dto/promotion/create-promotion-products.dto';
import { PromotionsProductsService } from './promotions-products.service';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UsePipes(new ValidationPipe())
@Auth()
@Controller('admin/promotions/products')
export class AdminPromotionsProductsController {
  promotionsService: any;
  constructor(
    private readonly promotionsProductsService: PromotionsProductsService,
  ) {}

  @HttpCode(200)
  @Post('add')
  async create(@Body() dto: CreatePromotionProductsDto[]) {
    return this.promotionsProductsService.addProducts(dto);
  }

  @HttpCode(200)
  @Delete('del')
  async delete(@Body() dto: DeletePromotionProductsDto[]) {
    return this.promotionsProductsService.deleteProducts(dto);
  }
}
