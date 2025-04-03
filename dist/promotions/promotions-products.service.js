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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const products_service_1 = require("../products/products.service");
let PromotionsProductsService = class PromotionsProductsService {
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async getAll(promoId, sortBy, sort, limit, page, isLowStock = true) {
        const promoProducts = await this.prisma.promoProducts.findMany({
            where: { promoId },
            select: { productId: true },
        });
        const productIds = promoProducts.map((promoProduct) => promoProduct.productId);
        if (productIds.length === 0) {
            return { page, limit, totalCount: 0, resultCount: 0, result: [] };
        }
        const sortedProducts = await this.productsService.getAll(undefined, sortBy, sort, limit, page, isLowStock, true, { id: { in: productIds } });
        return {
            page,
            limit,
            totalCount: sortedProducts.totalCount,
            totalResult: sortedProducts.result.length,
            result: sortedProducts,
        };
    }
    async addProducts(dto) {
        return this.prisma.promoProducts.createMany({
            data: dto.map(({ productId, promoId }) => ({
                productId,
                promoId,
            })),
            skipDuplicates: true,
        });
    }
    async deleteProducts(dto) {
        return this.prisma.promoProducts.deleteMany({
            where: {
                OR: dto.map(({ productId, promoId }) => ({
                    productId,
                    promoId,
                })),
            },
        });
    }
};
exports.PromotionsProductsService = PromotionsProductsService;
exports.PromotionsProductsService = PromotionsProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], PromotionsProductsService);
//# sourceMappingURL=promotions-products.service.js.map