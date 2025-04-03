import { IsNumber, Min } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class priceHistoryDto {
  @IsNumber()
  @Min(0)
  oldPrice: number;

  @IsNumber()
  @Min(0)
  newPrice: number;

  @IsCuid({ message: 'ID должен быть корректным CUID' })
  productId: string;
}
