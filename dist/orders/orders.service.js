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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
const products_service_1 = require("../products/products.service");
const date_fns_1 = require("date-fns");
const cart_service_1 = require("../cart/cart.service");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const create_order_dto_1 = require("./dto/order/create-order.dto");
const isEqual = require("lodash.isequal");
const pick = require("lodash.pick");
const DELIVERY_DAY = 7;
let OrdersService = class OrdersService {
    constructor(prisma, productsService, cartService, schedulerRegistry) {
        this.prisma = prisma;
        this.productsService = productsService;
        this.cartService = cartService;
        this.schedulerRegistry = schedulerRegistry;
    }
    async getOne(uniqValue, identifier, include = true, userId) {
        const order = await this.prisma.orders.findFirst({
            where: {
                [identifier]: uniqValue,
                type: 'ORDER',
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                category: include,
                            },
                        },
                    },
                },
                orderStatusHistory: include,
                userInfo: include,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Заказ не найден');
        if (userId && order.userId !== userId) {
            throw new common_1.ForbiddenException('Заказ другого пользователя');
        }
        return order;
    }
    async getAll(userId, publicId, status, sortBy, sort, limit, page, email, phone, deliveryMethod, paymentMethod) {
        const where = {
            type: 'ORDER',
            ...(status ? { status } : {}),
            ...(publicId ? { publicId } : {}),
            ...(userId ? { userId } : {}),
            ...(deliveryMethod ? { deliveryMethod } : {}),
            ...(paymentMethod ? { paymentMethod } : {}),
            ...(email
                ? { userInfo: { email: { contains: email, mode: 'insensitive' } } }
                : {}),
            ...(phone
                ? { userInfo: { phone: { contains: phone, mode: 'insensitive' } } }
                : {}),
        };
        console.log(where);
        const orderBy = sortBy
            ? { [sortBy]: sort }
            : {};
        const ordersList = await this.prisma.orders.findMany({
            where,
            orderBy,
            ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
            include: {
                orderItems: { include: { product: true } },
                userInfo: true,
            },
        });
        const totalCount = await this.prisma.orders.count({
            where,
        });
        return {
            page,
            limit,
            totalCount,
            totalResult: ordersList.length,
            result: ordersList,
        };
    }
    async createByUser(dto, userId) {
        return this.createOrder(dto, userId);
    }
    async createByAdmin(dto) {
        return this.createOrder(dto);
    }
    async createOrder(dto, userId) {
        if (!userId) {
            const user = await this.prisma.users.findUnique({
                where: { email: dto.userInfo.email },
                select: { id: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('Пользователь с таким email не найден');
            }
            userId = user.id;
        }
        const { userInfo, orderItems, ...data } = dto;
        await this.checkStockAvailability(orderItems);
        return this.prisma.$transaction(async (prisma) => {
            const lastOrder = await prisma.orders.findFirst({
                where: { type: 'ORDER' },
                orderBy: { publicId: 'desc' },
                select: { publicId: true },
            });
            const publicId = lastOrder
                ? (Number(lastOrder.publicId) + 1).toString().padStart(6, '0')
                : '000001';
            const createdUserInfo = await prisma.userInfo.create({ data: userInfo });
            const totals = this.calculateOrderTotals(dto);
            const status = 'status' in dto && dto.status ? dto.status : client_1.OrderStatus.CREATED;
            const expectedDate = 'expectedDate' in dto && dto.expectedDate
                ? dto.expectedDate
                : (0, date_fns_1.addDays)(new Date(), DELIVERY_DAY);
            const order = await prisma.orders.create({
                data: {
                    ...data,
                    ...totals,
                    publicId,
                    type: 'ORDER',
                    status,
                    expectedDate,
                    ...(status === client_1.OrderStatus.COMPLETED && {
                        completed: true,
                        completedDate: new Date(),
                    }),
                    user: { connect: { id: userId } },
                    userInfo: { connect: { id: createdUserInfo.id } },
                },
                include: { userInfo: true, orderItems: true },
            });
            await prisma.orderStatusHistory.create({
                data: { status, order: { connect: { id: order.id } } },
            });
            const responseOrderItems = await prisma.orderItems.createManyAndReturn({
                data: orderItems.map((item) => ({
                    ...item,
                    totalPrice: item.quantity * item.unitPrice,
                    totalDiscount: item.quantity * item.discount,
                    originalPrice: item.unitPrice + item.discount,
                    totalOriginalPrice: item.quantity * (item.unitPrice + item.discount),
                    orderId: order.id,
                })),
                include: { product: true },
            });
            await this.updateStockAndCounts(orderItems, prisma, 'decrement', 'increment', 'increment');
            if (dto instanceof create_order_dto_1.CreateOrderDto) {
                await this.clearCart(userId, prisma);
            }
            return { ...order, orderItems: responseOrderItems };
        });
    }
    async updateOrder(dto, orderId) {
        const currentOrder = await this.getOne(orderId, 'id');
        if (currentOrder.status == client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Нельзя изменить отмененный заказ');
        }
        if (currentOrder.status == client_1.OrderStatus.RETURNED) {
            throw new common_1.BadRequestException('Нельзя изменить возвращенный заказ');
        }
        return this.prisma.$transaction(async (prisma) => {
            if (dto?.manualDiscount !== currentOrder.manualDiscount ||
                dto?.orderItems.length > 0 ||
                dto?.percentDiscount !== currentOrder.percentDiscount) {
                this.calculateOrderTotals(dto);
            }
            if (dto?.status !== currentOrder.status) {
                await prisma.orderStatusHistory.create({
                    data: {
                        status: dto.status,
                        order: {
                            connect: { id: currentOrder.id },
                        },
                    },
                });
                if (dto.status === client_1.OrderStatus.CANCELLED ||
                    dto.status === client_1.OrderStatus.RETURNED) {
                    await this.updateStockAndCounts(currentOrder.orderItems, prisma, 'increment', 'decrement', 'decrement');
                    return prisma.orders.update({
                        where: { id: orderId },
                        data: {
                            status: dto.status,
                            completed: false,
                        },
                        include: {
                            orderItems: { include: { product: true } },
                            userInfo: true,
                        },
                    });
                }
            }
            const { id, ...currentUserInfo } = currentOrder.userInfo;
            if (dto.userInfo &&
                !isEqual({ ...dto.userInfo }, { ...currentUserInfo })) {
                await prisma.userInfo.update({
                    where: { id: currentOrder.userInfoId },
                    data: dto.userInfo,
                });
            }
            if (dto.orderItems?.length) {
                const currentOrderItems = currentOrder.orderItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount,
                }));
                if (!isEqual(dto.orderItems.map((obj) => ({ ...obj })), currentOrderItems)) {
                    await this.updateOrderItems(prisma, currentOrder.orderItems, dto.orderItems, orderId);
                }
            }
            const { orderItems, userInfo, ...dataOrder } = dto;
            return prisma.orders.update({
                where: { id: orderId },
                data: {
                    ...dataOrder,
                    ...(dataOrder?.status === client_1.OrderStatus.COMPLETED && {
                        completed: true,
                        completedDate: new Date(),
                    }),
                },
                include: { orderItems: { include: { product: true } }, userInfo: true },
            });
        });
    }
    async updateOrderItems(prisma, currentItems, newItems, orderId) {
        const currentMap = new Map(currentItems.map((item) => [item.productId, item]));
        const newMap = new Map(newItems.map((item) => [item.productId, item]));
        const toDelete = currentItems.filter((item) => !newMap.has(item.productId));
        const toAdd = newItems.filter((item) => !currentMap.has(item.productId));
        await this.checkStockAvailability(toAdd);
        const toUpdate = newItems.filter((item) => currentMap.has(item.productId) &&
            !isEqual({ ...item }, pick(currentMap.get(item.productId), [
                'productId',
                'quantity',
                'unitPrice',
                'discount',
            ])));
        const toUpdateQuantity = toUpdate.map((item) => {
            const prevItem = currentMap.get(item.productId);
            const quantityDiff = item.quantity - (prevItem?.quantity || 0);
            return {
                ...item,
                quantityDiff,
                prevQuantity: prevItem?.quantity || 0,
                id: prevItem?.id,
            };
        });
        await this.checkStockAvailability(toUpdateQuantity
            .filter((item) => item.quantityDiff > 0)
            .map((item) => ({
            quantity: item.quantityDiff,
            productId: item.productId,
        })));
        await this.updateStockAndCounts(toDelete, prisma, 'increment', 'decrement', 'decrement');
        await prisma.orderItems.deleteMany({
            where: { id: { in: toDelete.map((item) => item.id) } },
        });
        await this.updateStockAndCounts(toAdd, prisma, 'decrement', 'increment', 'increment');
        await prisma.orderItems.createMany({
            data: toAdd.map((item) => ({
                ...item,
                totalPrice: item.quantity * item.unitPrice,
                totalDiscount: item.quantity * item.discount,
                originalPrice: item.unitPrice + item.discount,
                totalOriginalPrice: item.quantity * (item.unitPrice + item.discount),
                orderId,
            })),
        });
        await Promise.all(toUpdateQuantity.map(async (item) => {
            if (item.quantityDiff > 0) {
                await prisma.products.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantityDiff },
                        purchaseCount: { increment: item.quantityDiff },
                    },
                });
            }
            else if (item.quantityDiff < 0) {
                await prisma.products.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: Math.abs(item.quantityDiff) },
                        purchaseCount: { decrement: Math.abs(item.quantityDiff) },
                    },
                });
            }
            const { id, productId, quantityDiff, prevQuantity, ...correctItem } = item;
            await prisma.orderItems.update({
                where: { id },
                data: {
                    ...correctItem,
                    totalPrice: item.quantity * item.unitPrice,
                    totalDiscount: item.quantity * item.discount,
                    originalPrice: item.unitPrice + item.discount,
                    totalOriginalPrice: item.quantity * (item.unitPrice + item.discount),
                },
            });
        }));
    }
    calculateOrderTotals(dto) {
        if (!dto.orderItems) {
            throw new common_1.BadRequestException('ордер итемы не переданы');
        }
        const totals = dto.orderItems.reduce((acc, item) => {
            acc.discount += item.quantity * item.discount;
            acc.originalTotal += item.quantity * (item.discount + item.unitPrice);
            acc.quantity += item.quantity;
            acc.total += item.quantity * item.unitPrice;
            return acc;
        }, { total: 0, discount: 0, quantity: 0, originalTotal: 0 });
        if (dto.percentDiscount) {
            totals.total -= (totals.total * dto.percentDiscount) / 100;
        }
        if ('manualDiscount' in dto && dto.manualDiscount) {
            if (dto.manualDiscount > totals.total) {
                throw new common_1.BadRequestException(`Ручная скидка: ${dto.manualDiscount} больше суммы заказа: ${totals.total}`);
            }
            totals.total -= dto.manualDiscount;
        }
        totals.total = Math.max(0, totals.total);
        return totals;
    }
    async delete(id) {
        return this.prisma.orders.delete({
            where: {
                id,
            },
        });
    }
    async checkStockAvailability(orderItems) {
        if (!(orderItems.length > 0)) {
            return;
        }
        const productIds = orderItems.map((item) => item.productId);
        const products = await this.prisma.products.findMany({
            where: { id: { in: productIds } },
        });
        if (products.length !== productIds.length) {
            throw new common_1.NotFoundException('Некоторые товары не найдены');
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const item of orderItems) {
            const product = productMap.get(item.productId);
            if (item.quantity > product.stock) {
                throw new common_1.BadRequestException(`Запрашиваемое количество (${item.quantity}) товара id:"${product.id}" "${product.name}" превышает остаток (${product.stock})`);
            }
        }
    }
    async updateStockAndCounts(items, prisma, stock, purchaseCount, ordersCount) {
        await Promise.all(items.map((item) => prisma.products.update({
            where: { id: item.productId },
            data: {
                ...(stock && { stock: { [stock]: item.quantity } }),
                ...(ordersCount && { ordersCount: { [ordersCount]: 1 } }),
                ...(purchaseCount && {
                    purchaseCount: { [purchaseCount]: item.quantity },
                }),
            },
        })));
    }
    async clearCart(userId, prisma) {
        const cart = await prisma.orders.findFirst({
            where: { userId, type: 'CART' },
            select: { id: true },
        });
        if (cart) {
            await prisma.orderItems.deleteMany({ where: { orderId: cart.id } });
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService,
        cart_service_1.CartService,
        schedule_1.SchedulerRegistry])
], OrdersService);
//# sourceMappingURL=orders.service.js.map