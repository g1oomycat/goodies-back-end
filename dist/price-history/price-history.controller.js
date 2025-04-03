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
exports.AdminPriceHistoryController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
const roles_guard_1 = require("../users/guards/roles.guard");
const price_history_service_1 = require("./price-history.service");
let AdminPriceHistoryController = class AdminPriceHistoryController {
    constructor(priceHistoryService) {
        this.priceHistoryService = priceHistoryService;
    }
    async getAll(productId, name, sortBy = 'createdAt', sort = 'desc', limit = '20', page = '1') {
        return this.priceHistoryService.getAll(productId, name, sortBy, sort, Number(limit), Number(page));
    }
    async getOne(id) {
        return this.priceHistoryService.getOne(id);
    }
};
exports.AdminPriceHistoryController = AdminPriceHistoryController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Query)('productId')),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sort')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminPriceHistoryController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPriceHistoryController.prototype, "getOne", null);
exports.AdminPriceHistoryController = AdminPriceHistoryController = __decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('admin/price-history'),
    __metadata("design:paramtypes", [price_history_service_1.PriceHistoryService])
], AdminPriceHistoryController);
//# sourceMappingURL=price-history.controller.js.map