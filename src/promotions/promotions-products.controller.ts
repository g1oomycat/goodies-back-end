import { Controller, Get, Query } from '@nestjs/common';

import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { getBoolean } from 'src/common/utils/get-boolean';
import { PromotionsProductsService } from './promotions-products.service';
import { ISortPromotionsProducts } from './types/sort';

@Controller('promotions/products')
export class PromotionsProductsController {
  promotionsService: any;
  constructor(
    private readonly promotionsProductsService: PromotionsProductsService,
  ) {}

  @Get('get')
  async getAll(
    @Query('promoId') promoId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy')
    sortBy?: ISortPromotionsProducts,
    @Query('sort') sort?: IParamsSort,
    @Query('isLowStock') isLowStock: BooleanLikeString = 'y',
  ) {
    return this.promotionsProductsService.getAll(
      promoId,
      sortBy,
      sort,
      parseInt(limit, 10) || undefined,
      parseInt(page, 10) || undefined,
      getBoolean(isLowStock),
    );
  }
}
