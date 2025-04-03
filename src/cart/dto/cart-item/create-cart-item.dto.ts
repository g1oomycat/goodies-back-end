import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class CreateCartItemDto {
  @IsCuid()
  productId: string;
}
