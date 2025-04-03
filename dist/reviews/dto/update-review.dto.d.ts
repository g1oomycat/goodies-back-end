import { CreateReviewDto } from './create-review.dto';
declare const UpdateReviewDto_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<CreateReviewDto>, "productId">>;
export declare class UpdateReviewDto extends UpdateReviewDto_base {
}
export {};
