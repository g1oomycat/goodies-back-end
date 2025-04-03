type IncrementDecrement = {
    increment?: number;
    decrement?: number;
};
export declare class UpdateProductMetricsDto {
    purchaseCount?: IncrementDecrement;
    ordersCount?: IncrementDecrement;
    stock?: IncrementDecrement;
}
export {};
