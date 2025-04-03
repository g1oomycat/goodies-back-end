import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IParamsSort } from 'src/common/types/sort';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { PriceHistoryService } from './price-history.service';
import { ISortPriceHistory } from './types/sort';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Auth()
@Controller('admin/price-history')
export class AdminPriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Get()
  @HttpCode(200)
  async getAll(
    @Query('productId') productId?: string,
    @Query('name') name?: string,
    @Query('sortBy') sortBy: ISortPriceHistory = 'createdAt',
    @Query('sort') sort: IParamsSort = 'desc',
    @Query('limit') limit: string = '20',
    @Query('page') page: string = '1',
  ) {
    return this.priceHistoryService.getAll(
      productId,
      name,
      sortBy,
      sort,
      Number(limit),
      Number(page),
    );
  }

  @Get(':id')
  @HttpCode(200)
  async getOne(@Param('id') id: string) {
    return this.priceHistoryService.getOne(id);
  }
}
