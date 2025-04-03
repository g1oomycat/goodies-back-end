import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { IsCuid } from 'src/common/validators/is-cuid.validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsCuid({ message: 'ID должен быть корректным CUID' })
  productId: string;
}
