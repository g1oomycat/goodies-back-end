import { OrderDeliveryMethod, OrderPaymentMethod } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { capitalizeFirstLetter } from 'src/common/utils/capitalize-first-letter';
import { CreateBulkOrderItemDto } from '../order-item/create-order-items.dto';

export class UserInfoDto {
  @Transform(({ value }) => capitalizeFirstLetter(value))
  @IsString()
  firstName: string;

  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('KZ', {
    message: 'Введите корректный номер телефона Казахстана',
  })
  phone: string;
}

export class CreateOrderDto {
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(1)
  percentDiscount?: number;

  @IsEnum(OrderDeliveryMethod)
  deliveryMethod: OrderDeliveryMethod;

  @IsEnum(OrderPaymentMethod)
  paymentMethod: OrderPaymentMethod;

  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsArray()
  @ArrayNotEmpty({ message: 'Список товаров не может быть пустым' })
  @ValidateNested({ each: true })
  @Type(() => CreateBulkOrderItemDto)
  orderItems: CreateBulkOrderItemDto[];
}
