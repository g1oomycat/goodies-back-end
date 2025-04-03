export enum EnumSortOrders {
  TOTAL = 'total',
  PUBLIC_ID = 'publicId',
  QUANTITY = 'quantity',
  STATUS = 'status',
  DELIVERY_METHOD = 'deliveryMethod',
  PAYMENT_METHOD = 'paymentMethod',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
export type ISortOrders =
  | 'total'
  | 'publicId'
  | 'quantity'
  | 'status'
  | 'deliveryMethod'
  | 'paymentMethod'
  | 'createdAt'
  | 'updatedAt';
