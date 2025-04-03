export enum EnumSortProducts {
  STOCK = 'stock',
  PRICE = 'price',
  PURCHASE_COUNT = 'purchaseCount',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PERCENT_CHANGE = 'percentageChange',
  NAME = 'name',
}
export type ISortProducts =
  | 'stock'
  | 'price'
  | 'name'
  | 'purchaseCount'
  | 'updatedAt'
  | 'createdAt'
  | 'percentageChange';
