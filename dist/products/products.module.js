"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const price_history_module_1 = require("../price-history/price-history.module");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
const admin_products_controller_1 = require("./admin-products.controller");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [price_history_module_1.PriceHistoryModule],
        controllers: [products_controller_1.ProductsController, admin_products_controller_1.AdminProductsController],
        providers: [products_service_1.ProductsService, prisma_service_1.PrismaService, s3_service_1.S3Service],
        exports: [products_service_1.ProductsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map