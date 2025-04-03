import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewInstagramDto } from './create-reviews-instagram.dto';

export class UpdateReviewsInstagramDto extends PartialType(
  CreateReviewInstagramDto,
) {}
