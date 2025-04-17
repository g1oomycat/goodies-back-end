import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  OrderDeliveryMethod,
  OrderItems,
  OrderPaymentMethod,
  OrderStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';

import { addDays } from 'date-fns';
import { CartService } from 'src/cart/cart.service';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { CreateBulkOrderItemDto } from './dto/order-item/create-order-items.dto';
import { CreateOrderByAdminDto } from './dto/order/create-order-by-admin.dto';
import { CreateOrderDto } from './dto/order/create-order.dto';
import { UpdateOrderByAdminDto } from './dto/order/update-order-by-admin.dto';
import { ISortOrders } from './types/sort';

import { DefaultArgs } from '@prisma/client/runtime/library';

import isEqual = require('lodash.isequal');
import pick = require('lodash.pick');

const DELIVERY_DAY = 7;

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private cartService: CartService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async getOne(
    uniqValue: string,
    identifier: 'id' | 'publicId',
    include: boolean = true,
    userId?: string,
  ) {
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
    if (!order) throw new NotFoundException('Заказ не найден');
    if (userId && order.userId !== userId) {
      throw new ForbiddenException('Заказ другого пользователя');
    }
    return order;
  }

  async getAll(
    userId?: string,
    publicId?: string,
    status?: OrderStatus,
    sortBy?: ISortOrders,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
    email?: string,
    phone?: string,
    deliveryMethod?: OrderDeliveryMethod,
    paymentMethod?: OrderPaymentMethod,
  ) {
    const where: Prisma.OrdersWhereInput = {
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

    const orderBy: Prisma.OrdersOrderByWithRelationInput = sortBy
      ? { [sortBy]: sort }
      : {};

    const ordersList = await this.prisma.orders.findMany({
      where,
      orderBy,
      ...GetSkipAndPage(page, limit),
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

  async createByUser(dto: CreateOrderDto, userId: string) {
    return this.createOrder(dto, userId);
  }

  async createByAdmin(dto: CreateOrderByAdminDto) {
    return this.createOrder(dto);
  }

  private async createOrder(
    dto: CreateOrderByAdminDto | CreateOrderDto,
    userId?: string,
  ) {
    // Если userId не передан, пытаемся найти пользователя по email
    if (!userId) {
      const user = await this.prisma.users.findUnique({
        where: { email: dto.userInfo.email },
        select: { id: true },
      });
      if (!user) {
        throw new NotFoundException('Пользователь с таким email не найден');
      }
      userId = user.id;
    }

    // Деструктурируем DTO, отделяя userInfo и orderItems от остальных данных
    const { userInfo, orderItems, ...data } = dto;

    // Проверяем доступность товаров на складе
    await this.checkStockAvailability(orderItems);

    return this.prisma.$transaction(async (prisma) => {
      // Получаем последний заказ для генерации нового publicId
      const lastOrder = await prisma.orders.findFirst({
        where: { type: 'ORDER' },
        orderBy: { publicId: 'desc' },
        select: { publicId: true },
      });

      // Генерируем новый publicId для заказа
      const publicId = lastOrder
        ? (Number(lastOrder.publicId) + 1).toString().padStart(6, '0')
        : '000001';

      // Создаём запись userInfo
      const createdUserInfo = await prisma.userInfo.create({ data: userInfo });

      // Рассчитываем суммы заказа (общая стоимость, скидки и т.д.)
      const totals = this.calculateOrderTotals(dto);

      // Устанавливаем статус заказа по умолчанию, если он не передан
      const status: OrderStatus =
        'status' in dto && dto.status ? dto.status : OrderStatus.CREATED;

      // Определяем ожидаемую дату доставки, если она не передана
      const expectedDate: Date =
        'expectedDate' in dto && dto.expectedDate
          ? dto.expectedDate
          : addDays(new Date(), DELIVERY_DAY);

      // Создаём заказ в базе данных
      const order = await prisma.orders.create({
        data: {
          ...data,
          ...totals,
          publicId,
          type: 'ORDER',
          status,
          expectedDate,
          ...(status === OrderStatus.COMPLETED && {
            completed: true,
            completedDate: new Date(),
          }),
          user: { connect: { id: userId } },
          userInfo: { connect: { id: createdUserInfo.id } },
        },
        include: { userInfo: true, orderItems: true },
      });

      // Добавляем запись в историю статусов заказа
      await prisma.orderStatusHistory.create({
        data: { status, order: { connect: { id: order.id } } },
      });

      // Добавляем товары в заказ и получаем их список
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

      // Обновляем информацию о товарах на складе
      await this.updateStockAndCounts(
        orderItems,
        prisma,
        'decrement',
        'increment',
        'increment',
      );

      // Проверяем наличие корзины у пользователя и очищаем её, если заказ создан юзером
      if (dto instanceof CreateOrderDto) {
        await this.clearCart(userId, prisma);
      }

      return { ...order, orderItems: responseOrderItems };
    });
  }

  async updateOrder(dto: UpdateOrderByAdminDto, orderId: string) {
    // Получаем текущий заказ по ID
    const currentOrder = await this.getOne(orderId, 'id');
    if (currentOrder.status == OrderStatus.CANCELLED) {
      throw new BadRequestException('Нельзя изменить отмененный заказ');
    }
    if (currentOrder.status == OrderStatus.RETURNED) {
      throw new BadRequestException('Нельзя изменить возвращенный заказ');
    }
    return this.prisma.$transaction(async (prisma) => {
      // Перерасчет стоимости
      if (
        dto?.manualDiscount !== currentOrder.manualDiscount ||
        dto?.orderItems.length > 0 ||
        dto?.percentDiscount !== currentOrder.percentDiscount
      ) {
        this.calculateOrderTotals(dto);
      }
      // Если изменился статус заказа, добавляем запись в историю статусов
      if (dto?.status !== currentOrder.status) {
        await prisma.orderStatusHistory.create({
          data: {
            status: dto.status,
            order: {
              connect: { id: currentOrder.id },
            },
          },
        });
        if (
          dto.status === OrderStatus.CANCELLED ||
          dto.status === OrderStatus.RETURNED
        ) {
          await this.updateStockAndCounts(
            currentOrder.orderItems,
            prisma,
            'increment',
            'decrement',
            'decrement',
          );
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

      // Обновляем userInfo, если он изменился
      const { id, ...currentUserInfo } = currentOrder.userInfo;

      if (
        dto.userInfo &&
        !isEqual({ ...dto.userInfo }, { ...currentUserInfo })
      ) {
        await prisma.userInfo.update({
          where: { id: currentOrder.userInfoId },
          data: dto.userInfo,
        });
      }

      // Оптимизированное обновление товаров в заказе, если они изменились
      if (dto.orderItems?.length) {
        const currentOrderItems: CreateBulkOrderItemDto[] =
          currentOrder.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
          }));

        if (
          !isEqual(
            dto.orderItems.map((obj) => ({ ...obj })),
            currentOrderItems,
          )
        ) {
          await this.updateOrderItems(
            prisma,
            currentOrder.orderItems,
            dto.orderItems,
            orderId,
          );
          // updatedData = { ...updatedData, ...this.calculateOrderTotals(dto) };
        }
      }

      // Обновляем сам заказ
      const { orderItems, userInfo, ...dataOrder } = dto;
      return prisma.orders.update({
        where: { id: orderId },
        data: {
          ...dataOrder,
          ...(dataOrder?.status === OrderStatus.COMPLETED && {
            completed: true,
            completedDate: new Date(),
          }),
        },
        include: { orderItems: { include: { product: true } }, userInfo: true },
      });
    });
  }
  // 🔹 Оптимизированное обновление товаров в заказе
  private async updateOrderItems(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    currentItems: OrderItems[],
    newItems: CreateBulkOrderItemDto[],
    orderId: string,
  ) {
    const currentMap: Map<string, OrderItems> = new Map(
      currentItems.map((item) => [item.productId, item]),
    );
    const newMap = new Map(newItems.map((item) => [item.productId, item]));

    const toDelete: OrderItems[] = currentItems.filter(
      (item) => !newMap.has(item.productId),
    );
    const toAdd = newItems.filter((item) => !currentMap.has(item.productId));

    // Проверка остатков товаров для добавления
    await this.checkStockAvailability(toAdd);

    // Товары для добавления, только те, которые отличаются от текущих
    const toUpdate = newItems.filter(
      (item) =>
        currentMap.has(item.productId) &&
        !isEqual(
          { ...item },
          pick(currentMap.get(item.productId), [
            'productId',
            'quantity',
            'unitPrice',
            'discount',
          ]),
        ),
    );

    // Корректируем количество в обновляемых товарах
    const toUpdateQuantity: Array<
      CreateBulkOrderItemDto & {
        quantityDiff: number;
        prevQuantity: number;
        id: string;
      }
    > = toUpdate.map((item) => {
      const prevItem = currentMap.get(item.productId);
      const quantityDiff = item.quantity - (prevItem?.quantity || 0);

      return {
        ...item,
        quantityDiff,
        prevQuantity: prevItem?.quantity || 0,
        id: prevItem?.id!, // Добавляем ID для обновления
      };
    });

    // Проверяем остатки только для товаров, где увеличилось количество
    await this.checkStockAvailability(
      toUpdateQuantity
        .filter((item) => item.quantityDiff > 0)
        .map((item) => ({
          quantity: item.quantityDiff,
          productId: item.productId,
        })),
    );

    // Удаляем лишние товары и корректируем остатки
    await this.updateStockAndCounts(
      toDelete,
      prisma,
      'increment',
      'decrement',
      'decrement',
    );

    await prisma.orderItems.deleteMany({
      where: { id: { in: toDelete.map((item) => item.id) } },
    });

    // Добавляем новые товары и корректируем остатки
    await this.updateStockAndCounts(
      toAdd,
      prisma,
      'decrement',
      'increment',
      'increment',
    );

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
    // Обновляем измененные товары и корректируем остатки
    await Promise.all(
      toUpdateQuantity.map(async (item) => {
        // Коррекция stock: если количество увеличилось, уменьшаем stock, если уменьшилось — увеличиваем
        if (item.quantityDiff > 0) {
          await prisma.products.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantityDiff },
              purchaseCount: { increment: item.quantityDiff },
            },
          });
        } else if (item.quantityDiff < 0) {
          await prisma.products.update({
            where: { id: item.productId },
            data: {
              stock: { increment: Math.abs(item.quantityDiff) },
              purchaseCount: { decrement: Math.abs(item.quantityDiff) },
            },
          });
        }
        const { id, productId, quantityDiff, prevQuantity, ...correctItem } =
          item;
        await prisma.orderItems.update({
          where: { id },
          data: {
            ...correctItem,
            totalPrice: item.quantity * item.unitPrice,
            totalDiscount: item.quantity * item.discount,
            originalPrice: item.unitPrice + item.discount,
            totalOriginalPrice:
              item.quantity * (item.unitPrice + item.discount),
          },
        });
      }),
    );
  }

  // 🔹 Пересчет стоимости заказа
  private calculateOrderTotals(
    dto: CreateOrderByAdminDto | CreateOrderDto | UpdateOrderByAdminDto,
  ) {
    if (!dto.orderItems) {
      throw new BadRequestException('ордер итемы не переданы');
    }
    const totals = dto.orderItems.reduce(
      (acc, item) => {
        acc.discount += item.quantity * item.discount;
        acc.originalTotal += item.quantity * (item.discount + item.unitPrice);
        acc.quantity += item.quantity;
        acc.total += item.quantity * item.unitPrice;
        return acc;
      },
      { total: 0, discount: 0, quantity: 0, originalTotal: 0 },
    );

    if (dto.percentDiscount) {
      totals.total -= (totals.total * dto.percentDiscount) / 100;
    }
    if ('manualDiscount' in dto && dto.manualDiscount) {
      if (dto.manualDiscount > totals.total) {
        throw new BadRequestException(
          `Ручная скидка: ${dto.manualDiscount} больше суммы заказа: ${totals.total}`,
        );
      }
      totals.total -= dto.manualDiscount;
    }

    totals.total = Math.max(0, totals.total);
    return totals;
  }

  async delete(id: string) {
    return this.prisma.orders.delete({
      where: {
        id,
      },
    });
  }

  //проверка остатков
  private async checkStockAvailability(
    orderItems: {
      productId: string;
      quantity: number;
    }[],
  ) {
    if (!(orderItems.length > 0)) {
      return;
    }
    const productIds = orderItems.map((item) => item.productId);

    // Загружаем все товары одним запросом

    const products = await this.prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Некоторые товары не найдены');
    }
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of orderItems) {
      const product = productMap.get(item.productId);

      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Запрашиваемое количество (${item.quantity}) товара id:"${product.id}" "${product.name}" превышает остаток (${product.stock})`,
        );
      }
    }
  }

  private async updateStockAndCounts(
    items: CreateBulkOrderItemDto[],
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    stock?: 'decrement' | 'increment',
    purchaseCount?: 'decrement' | 'increment',
    ordersCount?: 'decrement' | 'increment',
  ) {
    await Promise.all(
      items.map((item) =>
        prisma.products.update({
          where: { id: item.productId },
          data: {
            ...(stock && { stock: { [stock]: item.quantity } }),
            ...(ordersCount && { ordersCount: { [ordersCount]: 1 } }),
            ...(purchaseCount && {
              purchaseCount: { [purchaseCount]: item.quantity },
            }),
          },
        }),
      ),
    );
  }
  private async clearCart(
    userId: string,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const cart = await prisma.orders.findFirst({
      where: { userId, type: 'CART' },
      select: { id: true },
    });

    if (cart) {
      await prisma.orderItems.deleteMany({ where: { orderId: cart.id } });
    }
  }
}

// private scheduleOrderCancellation(orderId: string) {
//   // const job = new CronJob(new Date(Date.now() + 30 * 60 * 1000), async () => {
//   const job = new CronJob(new Date(Date.now() + 5 * 1000), async () => {
//     await this.cancelOrderIfNotPaid(orderId);
//   });
//   this.schedulerRegistry.addCronJob(`cancel-order-${orderId}`, job);
//   job.start();
// }

// private async cancelOrderIfNotPaid(orderId: string) {
//   const order = await this.getOne(orderId, 'id');
//   if (
//     this.getStatusIndex(order.status) < this.getStatusIndex(OrderStatus.PAID)
//   ) {
//     await this.prisma.orders.update({
//       where: {
//         id: orderId,
//       },
//       data: { status: 'CANCELLED' },
//     });
//     //fix
//     for (const item of order.orderItems) {
//       await this.productsService.updateProductMetrics(item.productId, {
//         stock: { increment: item.quantity },
//       });
//     }
//   }
// }
