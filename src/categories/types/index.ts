export enum EnumSortCategories {
  COUNT_PRODUCT = 'countProduct',
  NUMBER_SORT = 'numberSort',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export type ISortCategories =
  | 'countProduct'
  | 'name'
  | 'numberSort'
  | 'createdAt'
  | 'updatedAt';
