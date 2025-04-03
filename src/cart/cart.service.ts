import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCartItemDto } from './dto/cart-item/create-cart-item.dto';
import { DeleteCartItemDto } from './dto/cart-item/delete-cart-item.dto';
import { UpdateCartItemDto } from './dto/cart-item/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOne(uniqValue: string, identifier: 'id' | 'userId') {
    const where: Prisma.OrdersWhereInput =
      identifier === 'userId'
        ? { [identifier]: uniqValue, type: 'CART' }
        : { [identifier]: uniqValue };

    return this.prisma.orders.findFirst({
      where,
      include: {
        orderItems: { include: { product: true } },
      },
    });
  }

  async getCart(userId: string, includeProduct: boolean = true) {
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
      throw new NotFoundException('Коризина не найдена');
    }
    const { total, discount, updatesList, deletesList } =
      cart.orderItems.reduce(
        (acc, item) => {
          const { price: total, stock, discount } = item.product;

          acc.total += total * item.quantity;
          acc.discount += discount * item.quantity;

          if (item.quantity > stock) acc.updatesList.push(item.id);
          if (stock === 0) acc.deletesList.push(item.id);

          return acc;
        },
        { total: 0, discount: 0, updatesList: [], deletesList: [] },
      );
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

  async addProduct(userId: string, dto: CreateCartItemDto) {
    const currentCart = await this.getOne(userId, 'userId');
    const currentQuantity = this.getCurrentQuantity(currentCart);
    if (currentQuantity >= 50) {
      throw new BadRequestException(
        'Максимальное количество товаров в корзине 50',
      );
    }
    const currentCartItems = await this.prisma.orderItems.findFirst({
      where: {
        orderId: currentCart.id,
        productId: dto.productId,
      },
    });
    if (currentCartItems) {
      throw new ConflictException('Товар уже в корзине');
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

  async updateProduct(userId: string, dto: UpdateCartItemDto) {
    if (dto.quantity <= 0) {
      throw new BadRequestException(
        'Количество не может быть меньше или равно 0',
      );
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
      throw new NotFoundException('Товара нет в корзине');
    }

    const currentQuantity = this.getCurrentQuantity(currentCart);
    if (currentCartItem.product.stock < dto.quantity) {
      throw new BadRequestException(
        'Количество товара превышает остаток товара',
      );
    }
    if (currentQuantity >= 50 && currentCartItem.quantity < dto.quantity) {
      throw new BadRequestException(
        'Максимальное количество товаров в корзине 50',
      );
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

  async deleteProduct(userId: string, dto: DeleteCartItemDto) {
    const currentCart = await this.getOne(userId, 'userId');
    const currentCartItem = await this.prisma.orderItems.findFirst({
      where: {
        orderId: currentCart.id,
        productId: dto.productId,
      },
    });
    if (!currentCartItem) {
      throw new NotFoundException('Товара нет в корзине');
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

  async create(userId: string) {
    const currentCart = await this.getOne(userId, 'userId');
    if (currentCart) {
      throw new ConflictException('Корзина уже существует');
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

  private getCurrentQuantity(order): number {
    return (
      order.orderItems?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ??
      0
    );
  }
}
