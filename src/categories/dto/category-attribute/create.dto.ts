import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

enum AttributeType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
}

export class CreateCategoryAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Название характеристики

  @IsEnum(AttributeType)
  type: AttributeType; // Тип характеристики

  @IsBoolean()
  @IsOptional()
  filterable?: boolean = true; // Фильтруемая ли характеристика (по умолчанию true)

  @ValidateIf((o) => o.type === AttributeType.SELECT) // Проверка, если type == SELECT
  @IsArray()
  @IsString({ each: true })
  @IsOptional() // Это поле обязательно только для типа SELECT
  options?: string[]; // Массив значений для SELECT
}
