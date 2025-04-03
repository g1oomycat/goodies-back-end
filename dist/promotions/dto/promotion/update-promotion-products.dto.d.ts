import { CreatePromotionDto } from '../promotion-products/create-promotion.dto';
declare const UpdatePromotionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePromotionDto>>;
export declare class UpdatePromotionDto extends UpdatePromotionDto_base {
    isActive: boolean;
}
export {};
