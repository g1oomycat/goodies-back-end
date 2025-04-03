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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const prisma_service_1 = require("../prisma.service");
const products_service_1 = require("../products/products.service");
let FavoritesService = class FavoritesService {
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async getAll(userId, limit, page, sortBy, sort, includeStatus = true) {
        const includeOptions = {
            product: {
                include: {
                    reviews: includeStatus,
                    category: includeStatus,
                    attributes: includeStatus,
                },
            },
        };
        const totalCount = await this.prisma.favorites.count({
            where: { userId },
        });
        if (!limit) {
            const favorites = await this.prisma.favorites.findMany({
                where: { userId },
                include: includeOptions,
            });
            return {
                page,
                limit: 0,
                totalCount,
                totalResult: favorites.length,
                result: favorites,
            };
        }
        if (sortBy === 'createdAt') {
            const favorites = await this.prisma.favorites.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
                include: includeOptions,
            });
            return {
                page,
                limit,
                totalCount,
                totalResult: favorites.length,
                result: favorites,
            };
        }
        const favoriteProducts = await this.prisma.favorites.findMany({
            where: { userId },
        });
        const productIds = favoriteProducts.map((fav) => fav.productId);
        if (productIds.length === 0) {
            return { page, limit, totalCount, totalResult: 0, result: [] };
        }
        const sortedProducts = await this.productsService.getAll(undefined, sortBy, sort, limit, page, true, true, { id: { in: productIds } });
        const sortedFavorites = sortedProducts.result
            .map((product) => {
            const fav = favoriteProducts.find((fav) => fav.productId === product.id);
            return fav ? { ...fav, product } : null;
        })
            .filter(Boolean);
        return {
            page,
            limit,
            totalCount,
            totalResult: sortedFavorites.length,
            result: sortedFavorites,
        };
    }
    async create(userId, dto) {
        const listFavorites = await this.getAll(userId, undefined, undefined, undefined, undefined, false);
        if (listFavorites.totalCount >= 99)
            throw new common_1.BadRequestException('Максимальное количество товаров в избранном 99');
        for (const item of listFavorites.result) {
            if (item.productId === dto.productId)
                throw new common_1.BadRequestException('Товар уже в избранном');
        }
        return this.prisma.favorites.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                product: {
                    connect: {
                        id: dto.productId,
                    },
                },
            },
            include: {
                product: {
                    include: {
                        category: true,
                        reviews: true,
                        attributes: true,
                    },
                },
            },
        });
    }
    async delete(userId, dto) {
        console.log(dto, userId);
        const favorite = await this.prisma.favorites.findFirst({
            where: {
                userId,
                productId: dto.productId,
            },
            select: {
                id: true,
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Товара нет в избранном');
        }
        return this.prisma.favorites.delete({
            where: {
                id: favorite.id,
            },
            include: {
                product: {
                    include: {
                        category: true,
                        reviews: true,
                        attributes: true,
                    },
                },
            },
        });
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map