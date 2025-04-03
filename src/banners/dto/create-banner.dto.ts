import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { convertToDate } from 'src/common/utils/convert-date';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsString()
  imageLG: string;

  @IsString()
  imageMD: string;

  @IsString()
  imageSM: string;

  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  @IsString()
  buttonBG?: string;

  @IsOptional()
  @IsString()
  buttonTextColor?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === 'Invalid Date' || value === ''
      ? undefined
      : convertToDate(value),
  )
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === 'Invalid Date' || value === ''
      ? undefined
      : convertToDate(value),
  )
  endDate?: Date;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Min(0)
  @IsNumber()
  @IsOptional()
  position?: number;
}
