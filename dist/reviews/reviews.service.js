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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
const prisma_service_1 = require("../prisma.service");
let ReviewsService = class ReviewsService {
    constructor(prisma, ordersService) {
        this.prisma = prisma;
        this.ordersService = ordersService;
    }
    async isBuyProduct(userId, productId) {
        const userOrders = await this.ordersService.getAll(userId);
        if (!userOrders) {
            return false;
        }
        for (let order of userOrders.result) {
            for (let orderItem of order.orderItems) {
                if (orderItem.productId === productId) {
                    return true;
                }
            }
        }
        return false;
    }
    async getOne(id) {
        return this.prisma.reviews.findUnique({
            where: {
                id,
            },
        });
    }
    async getAll(userId, productId, sortBy, sortReviews = 'asc') {
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (productId) {
            where.productId = productId;
        }
        const orderByClause = sortBy ? { [sortBy]: sortReviews } : {};
        return this.prisma.reviews.findMany({
            where,
            orderBy: orderByClause,
            include: {
                product: true,
                user: true,
            },
        });
    }
    async getAllByProductId(productId) {
        return this.prisma.reviews.findMany({
            where: {
                productId,
            },
        });
    }
    async create(dto, userId) {
        const { productId, ...data } = dto;
        const isBuy = await this.isBuyProduct(userId, productId);
        if (!isBuy) {
            throw new common_1.ForbiddenException('Товар еще не был куплен пользователем');
        }
        return this.prisma.reviews.create({
            data: {
                ...data,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                product: {
                    connect: {
                        id: productId,
                    },
                },
            },
        });
    }
    async update(dto, id) {
        return this.prisma.reviews.update({
            where: {
                id: id,
            },
            data: dto,
        });
    }
    async delete(id) {
        return this.prisma.reviews.delete({
            where: {
                id,
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_service_1.OrdersService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map