import { Controller, Get, Query } from '@nestjs/common';
import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { getBoolean } from 'src/common/utils/get-boolean';
import { BannersService } from './banners.service';
import { ISortBanners } from './types/sort';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async getAll(
    @Query('title') title?: string,
    @Query('isActive') isActive?: BooleanLikeString,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy')
    sortBy: ISortBanners = 'position',
    @Query('sort') sort: IParamsSort = 'desc',
  ) {
    return this.bannersService.getAll(
      title,
      getBoolean(isActive),
      sortBy,
      sort,
      parseInt(limit, 10) || undefined,
      parseInt(page, 10) || undefined,
    );
  }
}
