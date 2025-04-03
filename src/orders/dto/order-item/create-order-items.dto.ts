import { OmitType } from '@nestjs/mapped-types';
import { IsNumber, Min } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class CreateOrderItemDto {
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsCuid({ message: 'ID должен быть корректным CUID' })
  productId: string;

  @IsCuid({ message: 'ID должен быть корректным CUID' })
  orderId: string;
}

export class CreateBulkOrderItemDto extends OmitType(CreateOrderItemDto, [
  'orderId',
] as const) {}
