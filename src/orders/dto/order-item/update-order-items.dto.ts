import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-items.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
