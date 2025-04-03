import { ISortProducts } from 'src/products/types/sort';

export enum EnumSortFavorites {
  PRICE = 'price',
  PURCHASE_COUNT = 'purchaseCount',
  CREATED_AT = 'createdAt',
  PERCENT_CHANGE = 'percentageChange',
}
export type ISortFavorites = Exclude<ISortProducts, 'stock'>;
