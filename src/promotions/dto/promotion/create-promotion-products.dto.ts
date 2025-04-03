import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class CreatePromotionProductsDto {
  @IsCuid()
  productId: string;
  @IsCuid()
  promoId: string;
}
