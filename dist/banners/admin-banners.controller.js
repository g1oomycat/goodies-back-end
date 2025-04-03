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
exports.AdminBannersController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const delete_bulk_1 = require("../common/dto/delete-bulk");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
const roles_guard_1 = require("../users/guards/roles.guard");
const banners_service_1 = require("./banners.service");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const update_banner_dto_1 = require("./dto/update-banner.dto");
let AdminBannersController = class AdminBannersController {
    constructor(bannersService) {
        this.bannersService = bannersService;
    }
    async getOne(id) {
        return this.bannersService.getOne(id);
    }
    async create(dto) {
        return this.bannersService.create(dto);
    }
    async update(dto, id) {
        return this.bannersService.update(dto, id);
    }
    async deleteBulk(dto) {
        return this.bannersService.deleteBulk(dto);
    }
    async delete(id) {
        return this.bannersService.delete(id);
    }
};
exports.AdminBannersController = AdminBannersController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "getOne", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "create", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_banner_dto_1.UpdateBannerDto, String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_bulk_1.DeleteBulkDto]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "deleteBulk", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBannersController.prototype, "delete", null);
exports.AdminBannersController = AdminBannersController = __decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('admin/banners'),
    __metadata("design:paramtypes", [banners_service_1.BannersService])
], AdminBannersController);
//# sourceMappingURL=admin-banners.controller.js.map