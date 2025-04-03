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
exports.PromotionsProductsController = void 0;
const common_1 = require("@nestjs/common");
const get_boolean_1 = require("../common/utils/get-boolean");
const promotions_products_service_1 = require("./promotions-products.service");
let PromotionsProductsController = class PromotionsProductsController {
    constructor(promotionsProductsService) {
        this.promotionsProductsService = promotionsProductsService;
    }
    async getAll(promoId, page = '1', limit = '10', sortBy, sort, isLowStock = 'y') {
        return this.promotionsProductsService.getAll(promoId, sortBy, sort, parseInt(limit, 10) || undefined, parseInt(page, 10) || undefined, (0, get_boolean_1.getBoolean)(isLowStock));
    }
};
exports.PromotionsProductsController = PromotionsProductsController;
__decorate([
    (0, common_1.Get)('get'),
    __param(0, (0, common_1.Query)('promoId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sort')),
    __param(5, (0, common_1.Query)('isLowStock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PromotionsProductsController.prototype, "getAll", null);
exports.PromotionsProductsController = PromotionsProductsController = __decorate([
    (0, common_1.Controller)('promotions/products'),
    __metadata("design:paramtypes", [promotions_products_service_1.PromotionsProductsService])
], PromotionsProductsController);
//# sourceMappingURL=promotions-products.controller.js.map