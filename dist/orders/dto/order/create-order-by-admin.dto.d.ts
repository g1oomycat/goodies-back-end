import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './create-order.dto';
export declare class CreateOrderByAdminDto extends CreateOrderDto {
    manualDiscount?: number;
    status?: OrderStatus;
    expectedDate?: Date;
}
