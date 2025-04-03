import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async getOne(uniqValue: string, identifier: 'id' | 'userId') {
    return this.prisma.orders.findFirst({
      where: {
        [identifier]: uniqValue,
      },
      include: {
        orderItems: { include: { product: true } },
      },
    });
  }

  async getCheckout(userId: string, includeProduct: boolean = true) {
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
      throw new NotFoundException('Коризина не найдена');
    }

    return {
      totalQuantity: 1,
      result: checkout,
    };
  }
  async createCheckout(userId: string) {
    const cart = await this.prisma.orders.findFirst({
      where: { userId, type: 'CART' },
    });
    if (!cart) {
      throw new NotFoundException('Коризина не найдена');
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
}
