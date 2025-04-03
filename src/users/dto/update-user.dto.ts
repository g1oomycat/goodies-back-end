import { Gender } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { capitalizeFirstLetter } from 'src/common/utils/capitalize-first-letter';
import { convertToDate } from 'src/common/utils/convert-date';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  firstName?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastName?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  surName?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === 'Invalid Date' || value === ''
      ? undefined
      : convertToDate(value),
  )
  dateOfBirth?: Date;

  @IsPhoneNumber('KZ', {
    message: 'Введите корректный номер телефона Казахстана',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  gender?: Gender;
}
