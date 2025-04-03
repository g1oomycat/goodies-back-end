import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IParamsSort } from 'src/common/types/sort';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { CreateFavoritesDto } from './dto/create-favorites.dto';
import { FavoritesService } from './favorites.service';
import { ISortFavorites } from './types/sort';

@UsePipes(new ValidationPipe())
@Auth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(
    @CurrentUser('id') userId: string,
    @Query('limit') limit: string = '20',
    @Query('page') page: string = '1', // количество записей, которые нужно вернуть
    @Query('sortBy')
    sortBy?: ISortFavorites,
    @Query('sort') sort?: IParamsSort,
  ) {
    return this.favoritesService.getAll(
      userId,
      parseInt(limit, 10) || undefined,
      parseInt(page, 10) || undefined,
      sortBy,
      sort,
    );
  }

  @Post('add-product')
  @HttpCode(200)
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFavoritesDto,
  ) {
    return this.favoritesService.create(userId, dto);
  }

  @HttpCode(200)
  @Post('del-product')
  async delete(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFavoritesDto,
  ) {
    console.log('del-product');

    return this.favoritesService.delete(userId, dto);
  }
}
