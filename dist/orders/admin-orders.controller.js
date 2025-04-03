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
exports.AdminOrdersController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
const roles_guard_1 = require("../users/guards/roles.guard");
const create_order_by_admin_dto_1 = require("./dto/order/create-order-by-admin.dto");
const update_order_by_admin_dto_1 = require("./dto/order/update-order-by-admin.dto");
const orders_service_1 = require("./orders.service");
let AdminOrdersController = class AdminOrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getAll(sortBy = 'createdAt', sort = 'desc', userId, publicId, email, phone, deliveryMethod, paymentMethod, status, limit = '20', page = '1') {
        return this.ordersService.getAll(userId, publicId, status, sortBy, sort, Number(limit), Number(page), email, phone, deliveryMethod, paymentMethod);
    }
    async getOne(id) {
        return this.ordersService.getOne(id, 'id');
    }
    async create(dto) {
        return this.ordersService.createByAdmin(dto);
    }
    async update(dto, id) {
        return this.ordersService.updateOrder(dto, id);
    }
};
exports.AdminOrdersController = AdminOrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('sortBy')),
    __param(1, (0, common_1.Query)('sort')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('publicId')),
    __param(4, (0, common_1.Query)('email')),
    __param(5, (0, common_1.Query)('phone')),
    __param(6, (0, common_1.Query)('deliveryMethod')),
    __param(7, (0, common_1.Query)('paymentMethod')),
    __param(8, (0, common_1.Query)('status')),
    __param(9, (0, common_1.Query)('limit')),
    __param(10, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "getOne", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_by_admin_dto_1.CreateOrderByAdminDto]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_order_by_admin_dto_1.UpdateOrderByAdminDto, String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "update", null);
exports.AdminOrdersController = AdminOrdersController = __decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.Controller)('admin/orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], AdminOrdersController);
//# sourceMappingURL=admin-orders.controller.js.map