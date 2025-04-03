import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { getBoolean } from 'src/common/utils/get-boolean';
import { ProductsService } from './products.service';
import { ISortProducts } from './types/sort';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll(
    @Query('categoryId') categoryId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy')
    sortBy?: ISortProducts,
    @Query('sort') sort?: IParamsSort,
    @Query('isLowStock') isLowStock: BooleanLikeString = 'y',
    @Query('name') name?: string,
  ) {
    return this.productsService.getAll(
      categoryId,
      sortBy,
      sort,
      parseInt(limit, 10) || undefined,
      parseInt(page, 10) || undefined,
      getBoolean(isLowStock),
      true,
      {},
      name,
    );
  }

  @Get(':slug')
  async getOneBySlug(@Param('slug') slug: string) {
    return this.productsService.getOne(slug, 'slug');
  }
}
