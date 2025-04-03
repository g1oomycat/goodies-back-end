"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.UserInfoDto = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const capitalize_first_letter_1 = require("../../../common/utils/capitalize-first-letter");
const create_order_items_dto_1 = require("../order-item/create-order-items.dto");
class UserInfoDto {
}
exports.UserInfoDto = UserInfoDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, capitalize_first_letter_1.capitalizeFirstLetter)(value)),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserInfoDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, capitalize_first_letter_1.capitalizeFirstLetter)(value)),
    __metadata("design:type", String)
], UserInfoDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserInfoDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsPhoneNumber)('KZ', {
        message: 'Введите корректный номер телефона Казахстана',
    }),
    __metadata("design:type", String)
], UserInfoDto.prototype, "phone", void 0);
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "comment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "percentDiscount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.OrderDeliveryMethod),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "deliveryMethod", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.OrderPaymentMethod),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UserInfoDto),
    __metadata("design:type", UserInfoDto)
], CreateOrderDto.prototype, "userInfo", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Список товаров не может быть пустым' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_order_items_dto_1.CreateBulkOrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "orderItems", void 0);
//# sourceMappingURL=create-order.dto.js.map