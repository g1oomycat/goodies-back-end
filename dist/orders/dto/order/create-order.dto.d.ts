import { OrderDeliveryMethod, OrderPaymentMethod } from '@prisma/client';
import { CreateBulkOrderItemDto } from '../order-item/create-order-items.dto';
export declare class UserInfoDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}
export declare class CreateOrderDto {
    address: string;
    comment?: string;
    percentDiscount?: number;
    deliveryMethod: OrderDeliveryMethod;
    paymentMethod: OrderPaymentMethod;
    userInfo: UserInfoDto;
    orderItems: CreateBulkOrderItemDto[];
}
