import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends OmitType(PartialType(CreateReviewDto), [
  'productId',
] as const) {}
