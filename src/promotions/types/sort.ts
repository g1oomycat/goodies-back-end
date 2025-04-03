import { ISortProducts } from 'src/products/types/sort';

export type ISortPromotions = 'createdAt' | 'startDate' | 'endDate';
export type ISortPromotionsProducts = Exclude<ISortProducts, 'stock'>;
