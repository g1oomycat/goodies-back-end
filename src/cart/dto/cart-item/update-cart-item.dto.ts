import { IsNumber, Min } from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends CreateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}
