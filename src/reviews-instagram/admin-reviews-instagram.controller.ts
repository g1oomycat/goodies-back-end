import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';

import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { CreateReviewInstagramDto } from './dto/create-reviews-instagram.dto';
import { UpdateReviewsInstagramDto } from './dto/update-reviews-instagram.dto';
import { ReviewsInstagramService } from './reviews-instagram.service';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@UsePipes(new ValidationPipe())
@Auth()
@Controller('admin/reviews-instagram')
export class AdminReviewsInstagramController {
  constructor(
    private readonly reviewsInstagramService: ReviewsInstagramService,
  ) {}

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.reviewsInstagramService.getOne(id);
  }

  @HttpCode(200)
  @Post()
  async create(@Body() dto: CreateReviewInstagramDto) {
    return this.reviewsInstagramService.create(dto);
  }

  @HttpCode(200)
  @Put(':id')
  async update(
    @Body() dto: UpdateReviewsInstagramDto,
    @Param('id') id: string,
  ) {
    return this.reviewsInstagramService.update(dto, id);
  }
  @HttpCode(200)
  @Delete('bulk')
  async deleteBulk(@Body() dto: DeleteBulkDto) {
    return this.reviewsInstagramService.deleteBulk(dto);
  }
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewsInstagramService.delete(id);
  }
}
