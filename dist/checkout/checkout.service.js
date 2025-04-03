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
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CheckoutService = class CheckoutService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOne(uniqValue, identifier) {
        return this.prisma.orders.findFirst({
            where: {
                [identifier]: uniqValue,
            },
            include: {
                orderItems: { include: { product: true } },
            },
        });
    }
    async getCheckout(userId, includeProduct = true) {
        const checkout = await this.prisma.orders.findFirst({
            where: { userId, type: 'CHECKOUT' },
            include: {
                orderItems: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        product: {
                            include: {
                                category: includeProduct,
                                attributes: includeProduct,
                                reviews: includeProduct,
                            },
                        },
                    },
                },
            },
        });
        if (!checkout) {
            throw new common_1.NotFoundException('Коризина не найдена');
        }
        return {
            totalQuantity: 1,
            result: checkout,
        };
    }
    async createCheckout(userId) {
        const cart = await this.prisma.orders.findFirst({
            where: { userId, type: 'CART' },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Коризина не найдена');
        }
        const checkout = await this.prisma.orders.update({
            data: {
                type: 'CHECKOUT',
            },
            where: { id: cart.id },
        });
        return {
            totalQuantity: 1,
            result: checkout,
        };
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map