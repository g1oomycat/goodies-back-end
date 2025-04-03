import { OrderStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { convertToDate } from 'src/common/utils/convert-date';
import { CreateOrderDto } from './create-order.dto';

export class CreateOrderByAdminDto extends CreateOrderDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  manualDiscount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === 'Invalid Date' || value === ''
      ? undefined
      : convertToDate(value),
  )
  expectedDate?: Date;
}
