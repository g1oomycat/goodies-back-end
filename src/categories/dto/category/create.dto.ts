import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateCategoryAttributeDto } from '../category-attribute/create.dto';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryAttributeDto)
  @IsNotEmpty({ each: true }) // Указывает, что массив не должен быть пустым
  attributes?: CreateCategoryAttributeDto[]; // Характеристики категории

  @IsOptional()
  @Min(0)
  numberSort?: number;
}
