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
exports.AdminPromotionsProductsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
const roles_guard_1 = require("../users/guards/roles.guard");
const promotions_products_service_1 = require("./promotions-products.service");
let AdminPromotionsProductsController = class AdminPromotionsProductsController {
    constructor(promotionsProductsService) {
        this.promotionsProductsService = promotionsProductsService;
    }
    async create(dto) {
        return this.promotionsProductsService.addProducts(dto);
    }
    async delete(dto) {
        return this.promotionsProductsService.deleteProducts(dto);
    }
};
exports.AdminPromotionsProductsController = AdminPromotionsProductsController;
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AdminPromotionsProductsController.prototype, "create", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('del'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AdminPromotionsProductsController.prototype, "delete", null);
exports.AdminPromotionsProductsController = AdminPromotionsProductsController = __decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('admin/promotions/products'),
    __metadata("design:paramtypes", [promotions_products_service_1.PromotionsProductsService])
], AdminPromotionsProductsController);
//# sourceMappingURL=admin-promotions-products.controller.js.map