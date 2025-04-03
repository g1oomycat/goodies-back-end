"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
const admin_banners_controller_1 = require("./admin-banners.controller");
const banners_cron_service_1 = require("./banners-cron.service");
const banners_controller_1 = require("./banners.controller");
const banners_service_1 = require("./banners.service");
let BannersModule = class BannersModule {
};
exports.BannersModule = BannersModule;
exports.BannersModule = BannersModule = __decorate([
    (0, common_1.Module)({
        providers: [banners_service_1.BannersService, prisma_service_1.PrismaService, s3_service_1.S3Service, banners_cron_service_1.BannerCronService],
        controllers: [banners_controller_1.BannersController, admin_banners_controller_1.AdminBannersController],
    })
], BannersModule);
//# sourceMappingURL=banners.module.js.map