export declare class CreateOrderItemDto {
    quantity: number;
    discount: number;
    unitPrice: number;
    productId: string;
    orderId: string;
}
declare const CreateBulkOrderItemDto_base: import("@nestjs/mapped-types").MappedType<Omit<CreateOrderItemDto, "orderId">>;
export declare class CreateBulkOrderItemDto extends CreateBulkOrderItemDto_base {
}
export {};
