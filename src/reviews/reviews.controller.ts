import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id')
  @Auth()
  async getOne(@Param('id') id: string) {
    return this.reviewsService.getOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @Auth()
  async getAll(
    @Query('userId') userId?: string,
    @Query('productId') productId?: string,
    @Query('sortBy') sortBy?: 'rating' | 'updatedAt',
    @Query('sortReviews') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.reviewsService.getAll(userId, productId, sortBy, sortOrder);
  }

  @Get('product/:productId')
  async getAllByProductId(@Param('productId') productId: string) {
    return this.reviewsService.getAllByProductId(productId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.reviewsService.create(dto, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async update(@Body() dto: UpdateReviewDto, @Param('id') id: string) {
    return this.reviewsService.update(dto, id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
