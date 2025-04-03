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
exports.AdminReviewsInstagramController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_decorator_1 = require("../users/decorators/roles.decorator");
const roles_guard_1 = require("../users/guards/roles.guard");
const delete_bulk_1 = require("../common/dto/delete-bulk");
const create_reviews_instagram_dto_1 = require("./dto/create-reviews-instagram.dto");
const update_reviews_instagram_dto_1 = require("./dto/update-reviews-instagram.dto");
const reviews_instagram_service_1 = require("./reviews-instagram.service");
let AdminReviewsInstagramController = class AdminReviewsInstagramController {
    constructor(reviewsInstagramService) {
        this.reviewsInstagramService = reviewsInstagramService;
    }
    async getOne(id) {
        return this.reviewsInstagramService.getOne(id);
    }
    async create(dto) {
        return this.reviewsInstagramService.create(dto);
    }
    async update(dto, id) {
        return this.reviewsInstagramService.update(dto, id);
    }
    async deleteBulk(dto) {
        return this.reviewsInstagramService.deleteBulk(dto);
    }
    async delete(id) {
        return this.reviewsInstagramService.delete(id);
    }
};
exports.AdminReviewsInstagramController = AdminReviewsInstagramController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminReviewsInstagramController.prototype, "getOne", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reviews_instagram_dto_1.CreateReviewInstagramDto]),
    __metadata("design:returntype", Promise)
], AdminReviewsInstagramController.prototype, "create", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_reviews_instagram_dto_1.UpdateReviewsInstagramDto, String]),
    __metadata("design:returntype", Promise)
], AdminReviewsInstagramController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_bulk_1.DeleteBulkDto]),
    __metadata("design:returntype", Promise)
], AdminReviewsInstagramController.prototype, "deleteBulk", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminReviewsInstagramController.prototype, "delete", null);
exports.AdminReviewsInstagramController = AdminReviewsInstagramController = __decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Controller)('admin/reviews-instagram'),
    __metadata("design:paramtypes", [reviews_instagram_service_1.ReviewsInstagramService])
], AdminReviewsInstagramController);
//# sourceMappingURL=admin-reviews-instagram.controller.js.map