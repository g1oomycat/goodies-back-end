import { IsOptional } from 'class-validator';

type IncrementDecrement = {
  increment?: number;
  decrement?: number;
};

export class UpdateProductMetricsDto {
  @IsOptional()
  purchaseCount?: IncrementDecrement;
  @IsOptional()
  ordersCount?: IncrementDecrement;
  @IsOptional()
  stock?: IncrementDecrement;
}
