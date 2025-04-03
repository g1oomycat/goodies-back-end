import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateReviewInstagramDto {
  @IsString()
  name: string;
  @IsString()
  nick: string;
  @IsString()
  image: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Min(0)
  @IsNumber()
  @IsOptional()
  position?: number;
}
