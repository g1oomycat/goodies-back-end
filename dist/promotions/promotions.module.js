"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const products_module_1 = require("../products/products.module");
const s3_service_1 = require("../s3.service");
const admin_promotions_products_controller_1 = require("./admin-promotions-products.controller");
const admin_promotions_controller_1 = require("./admin-promotions.controller");
const promotions_products_controller_1 = require("./promotions-products.controller");
const promotions_products_service_1 = require("./promotions-products.service");
const promotions_controller_1 = require("./promotions.controller");
const promotions_service_1 = require("./promotions.service");
let PromotionsModule = class PromotionsModule {
};
exports.PromotionsModule = PromotionsModule;
exports.PromotionsModule = PromotionsModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule],
        providers: [
            promotions_service_1.PromotionsService,
            promotions_products_service_1.PromotionsProductsService,
            prisma_service_1.PrismaService,
            s3_service_1.S3Service,
        ],
        controllers: [
            promotions_controller_1.PromotionsController,
            admin_promotions_controller_1.AdminPromotionsController,
            admin_promotions_products_controller_1.AdminPromotionsProductsController,
            promotions_products_controller_1.PromotionsProductsController,
        ],
    })
], PromotionsModule);
//# sourceMappingURL=promotions.module.js.map