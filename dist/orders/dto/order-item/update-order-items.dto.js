"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderItemDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_order_items_dto_1 = require("./create-order-items.dto");
class UpdateOrderItemDto extends (0, mapped_types_1.PartialType)(create_order_items_dto_1.CreateOrderItemDto) {
}
exports.UpdateOrderItemDto = UpdateOrderItemDto;
//# sourceMappingURL=update-order-items.dto.js.map