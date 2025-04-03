import { IsOptional, IsString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  @IsOptional()
  startDate?: string | Date;

  @IsString()
  @IsOptional()
  endDate?: string | Date;
}
