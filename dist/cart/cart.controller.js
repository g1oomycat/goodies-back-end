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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const currentUser_decorator_1 = require("../users/decorators/currentUser.decorator");
const cart_service_1 = require("./cart.service");
const create_cart_item_dto_1 = require("./dto/cart-item/create-cart-item.dto");
const delete_cart_item_dto_1 = require("./dto/cart-item/delete-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/cart-item/update-cart-item.dto");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(userId) {
        return this.cartService.getCart(userId);
    }
    async addProduct(userId, dto) {
        return this.cartService.addProduct(userId, dto);
    }
    async updateProduct(userId, dto) {
        return this.cartService.updateProduct(userId, dto);
    }
    async deleteProduct(userId, dto) {
        return this.cartService.deleteProduct(userId, dto);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, currentUser_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('add-product'),
    __param(0, (0, currentUser_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cart_item_dto_1.CreateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Put)('update-product'),
    __param(0, (0, currentUser_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)('delete-product'),
    __param(0, (0, currentUser_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, delete_cart_item_dto_1.DeleteCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "deleteProduct", null);
exports.CartController = CartController = __decorate([
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map