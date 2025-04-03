import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class CreateFavoritesDto {
  @IsCuid()
  productId: string;
}
