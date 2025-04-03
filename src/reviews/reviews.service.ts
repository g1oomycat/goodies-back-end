import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  private async isBuyProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
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

  async getOne(id: string) {
    return this.prisma.reviews.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll(
    userId?: string,
    productId?: string,
    sortBy?: 'rating' | 'updatedAt',
    sortReviews: 'asc' | 'desc' = 'asc',
  ) {
    const where: Prisma.ReviewsWhereInput = {};
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

  async getAllByProductId(productId: string) {
    return this.prisma.reviews.findMany({
      where: {
        productId,
      },
    });
  }

  async create(dto: CreateReviewDto, userId: string) {
    const { productId, ...data } = dto;
    const isBuy: boolean = await this.isBuyProduct(userId, productId);
    if (!isBuy) {
      throw new ForbiddenException('Товар еще не был куплен пользователем');
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

  async update(dto: UpdateReviewDto, id: string) {
    return this.prisma.reviews.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.reviews.delete({
      where: {
        id,
      },
    });
  }
}
