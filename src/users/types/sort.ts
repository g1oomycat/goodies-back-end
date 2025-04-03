export enum EnumSortUsers {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  USER_ID = 'userId',
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  PHONE = 'phone',
  ROLE = 'role',
}

export type ISortUsers =
  | 'createdAt'
  | 'updatedAt'
  | 'userId'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'role';
