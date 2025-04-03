import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { IsCuid } from 'src/common/validators/is-cuid.validator';

export type ProductAttributesType = {
  categoryAttributeId: string;
  title: string;
  value: string | number | boolean;
};

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Min(0)
  @IsNumber()
  stock: number;

  @Min(0)
  @IsNumber()
  price: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Список фотографий не может быть пустым' })
  @ArrayMaxSize(6, { message: 'Максимальное количество фотографий — 6' })
  @IsUrl({}, { each: true })
  images: string[];

  @IsCuid({ message: 'ID должен быть корректным CUID' })
  categoryId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  attributes: ProductAttributesType[]; // Характеристики продукта
}
