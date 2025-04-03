import { Controller, Get, Query } from '@nestjs/common';
import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { getBoolean } from 'src/common/utils/get-boolean';
import { ReviewsInstagramService } from './reviews-instagram.service';
import { ISortReviewsInstagram } from './types/sort';

@Controller('reviews-instagram')
export class ReviewsInstagramController {
  constructor(
    private readonly reviewsInstagramService: ReviewsInstagramService,
  ) {}

  @Get()
  async getAll(
    @Query('name') name?: string,
    @Query('nick') nick?: string,
    @Query('isActive') isActive?: BooleanLikeString,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('sortBy')
    sortBy: ISortReviewsInstagram = 'position',
    @Query('sort') sort: IParamsSort = 'desc',
  ) {
    console.log(isActive);

    return this.reviewsInstagramService.getAll(
      name,
      nick,
      getBoolean(isActive),
      sortBy,
      sort,
      parseInt(limit, 10) || undefined,
      parseInt(page, 10) || undefined,
    );
  }
}
