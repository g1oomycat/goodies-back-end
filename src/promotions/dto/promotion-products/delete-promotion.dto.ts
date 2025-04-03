import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionProductsDto } from '../promotion/create-promotion-products.dto';

export class DeletePromotionProductsDto extends PartialType(
  CreatePromotionProductsDto,
) {}
