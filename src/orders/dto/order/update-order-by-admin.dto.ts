import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderByAdminDto } from './create-order-by-admin.dto';

export class UpdateOrderByAdminDto extends PartialType(CreateOrderByAdminDto) {}
