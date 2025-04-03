import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { getBoolean } from 'src/common/utils/get-boolean';
import { PromotionsService } from './promotions.service';
import { ISortPromotions } from './types/sort';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy')
    sortBy?: ISortPromotions,
    @Query('sort') sort?: IParamsSort,
    @Query('isActive') isActive: BooleanLikeString = 'y',
  ) {
    return this.promotionsService.getAll(
      sortBy,
      sort,
      parseInt(limit, 10) || undefined,
      parseInt(page, 10) || undefined,
      getBoolean(isActive),
    );
  }
  @Get(':slug')
  async getOneBySlug(@Param('slug') slug: string) {
    return this.promotionsService.getOne(slug, 'slug');
  }
}
