"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePromotionProductsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_promotion_products_dto_1 = require("../promotion/create-promotion-products.dto");
class DeletePromotionProductsDto extends (0, mapped_types_1.PartialType)(create_promotion_products_dto_1.CreatePromotionProductsDto) {
}
exports.DeletePromotionProductsDto = DeletePromotionProductsDto;
//# sourceMappingURL=delete-promotion.dto.js.map