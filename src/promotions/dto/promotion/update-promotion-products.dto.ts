import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePromotionDto } from '../promotion-products/create-promotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
