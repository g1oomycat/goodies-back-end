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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOne(uniqValue, identifier) {
        const where = identifier === 'userId'
            ? { [identifier]: uniqValue, type: 'CART' }
            : { [identifier]: uniqValue };
        return this.prisma.orders.findFirst({
            where,
            include: {
                orderItems: { include: { product: true } },
            },
        });
    }
    async getCart(userId, includeProduct = true) {
        const cart = await this.prisma.orders.findFirst({
            where: { userId, type: 'CART' },
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
        if (!cart) {
            throw new common_1.NotFoundException('Коризина не найдена');
        }
        const { total, discount, updatesList, deletesList } = cart.orderItems.reduce((acc, item) => {
            const { price: total, stock, discount } = item.product;
            acc.total += total * item.quantity;
            acc.discount += discount * item.quantity;
            if (item.quantity > stock)
                acc.updatesList.push(item.id);
            if (stock === 0)
                acc.deletesList.push(item.id);
            return acc;
        }, { total: 0, discount: 0, updatesList: [], deletesList: [] });
        const originalTotal = discount + total;
        return {
            total,
            discount,
            originalTotal,
            updatesList,
            deletesList,
            totalQuantity: this.getCurrentQuantity(cart),
            result: cart,
        };
    }
    async addProduct(userId, dto) {
        const currentCart = await this.getOne(userId, 'userId');
        const currentQuantity = this.getCurrentQuantity(currentCart);
        if (currentQuantity >= 50) {
            throw new common_1.BadRequestException('Максимальное количество товаров в корзине 50');
        }
        const currentCartItems = await this.prisma.orderItems.findFirst({
            where: {
                orderId: currentCart.id,
                productId: dto.productId,
            },
        });
        if (currentCartItems) {
            throw new common_1.ConflictException('Товар уже в корзине');
        }
        return await this.prisma.orderItems.create({
            data: {
                order: {
                    connect: {
                        id: currentCart.id,
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
                        attributes: true,
                        reviews: true,
                    },
                },
            },
        });
    }
    async updateProduct(userId, dto) {
        if (dto.quantity <= 0) {
            throw new common_1.BadRequestException('Количество не может быть меньше или равно 0');
        }
        const currentCart = await this.getOne(userId, 'userId');
        const currentCartItem = await this.prisma.orderItems.findFirst({
            where: {
                orderId: currentCart.id,
                productId: dto.productId,
            },
            include: { product: true },
        });
        if (!currentCartItem) {
            throw new common_1.NotFoundException('Товара нет в корзине');
        }
        const currentQuantity = this.getCurrentQuantity(currentCart);
        if (currentCartItem.product.stock < dto.quantity) {
            throw new common_1.BadRequestException('Количество товара превышает остаток товара');
        }
        if (currentQuantity >= 50 && currentCartItem.quantity < dto.quantity) {
            throw new common_1.BadRequestException('Максимальное количество товаров в корзине 50');
        }
        return await this.prisma.orderItems.update({
            where: {
                id: currentCartItem.id,
            },
            data: {
                quantity: dto.quantity,
            },
            include: {
                product: {
                    include: {
                        category: true,
                        attributes: true,
                        reviews: true,
                    },
                },
            },
        });
    }
    async deleteProduct(userId, dto) {
        const currentCart = await this.getOne(userId, 'userId');
        const currentCartItem = await this.prisma.orderItems.findFirst({
            where: {
                orderId: currentCart.id,
                productId: dto.productId,
            },
        });
        if (!currentCartItem) {
            throw new common_1.NotFoundException('Товара нет в корзине');
        }
        return await this.prisma.orderItems.delete({
            where: {
                id: currentCartItem.id,
            },
            include: {
                product: {
                    include: {
                        category: true,
                        attributes: true,
                        reviews: true,
                    },
                },
            },
        });
    }
    async create(userId) {
        const currentCart = await this.getOne(userId, 'userId');
        if (currentCart) {
            throw new common_1.ConflictException('Корзина уже существует');
        }
        const lastCart = await this.prisma.orders.findFirst({
            where: { type: 'CART' },
            orderBy: { publicId: 'desc' },
            select: { publicId: true },
        });
        const publicId = lastCart
            ? 'CART-' +
                (Number(lastCart.publicId.replace('CART-', '')) + 1)
                    .toString()
                    .padStart(6, '0')
            : 'CART-000001';
        return this.prisma.orders.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                type: 'CART',
                publicId,
            },
        });
    }
    getCurrentQuantity(order) {
        return (order.orderItems?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ??
            0);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map