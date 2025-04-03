export declare enum EnumSortPriceHistory {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    NAME = "name",
    OLD_PRICE = "oldPrice",
    NEW_PRICE = "newPrice",
    PERCENTAGE_CHANGE = "percentageChange"
}
export type ISortPriceHistory = 'oldPrice' | 'newPrice' | 'createdAt' | 'updatedAt' | 'percentageChange';
