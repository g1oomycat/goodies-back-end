import { Controller, Get, Param, Query } from '@nestjs/common';
import { IParamsSort } from 'src/common/types/sort';
import { CategoriesService } from './categories.service';
import { ISortCategories } from './types';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll(
    @Query('name') name?: string,
    @Query('sortBy')
    sortBy: ISortCategories = 'numberSort',
    @Query('sort') sort: IParamsSort = 'asc',
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
  ) {
    return this.categoriesService.getAll(
      name,
      sortBy,
      sort,
      Number(limit),
      Number(page),
    );
  }

  @Get(':slug')
  async getOneBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getOne(slug, 'slug');
  }
}
