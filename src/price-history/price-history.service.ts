import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { GetPercentageChange } from 'src/common/utils/get-percentage-change';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { PrismaService } from 'src/prisma.service';
import { priceHistoryDto } from './dto/price-history.dto';
import { ISortPriceHistory } from './types/sort';

@Injectable()
export class PriceHistoryService {
  constructor(private prisma: PrismaService) {}

  async getOne(id: string) {
    return this.prisma.priceHistory.findUnique({
      where: {
        id,
      },
    });
  }
  async getAll(
    productId?: string,
    name?: string,
    sortBy?: ISortPriceHistory,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
    includeStatus: boolean = true,
  ) {
    const where: Prisma.PriceHistoryWhereInput = {
      ...(productId ? { productId } : {}),
      ...(name
        ? { product: { name: { contains: name, mode: 'insensitive' } } }
        : {}),
    };
    const orderBy = sortBy ? { [sortBy]: sort } : {};
    const priceHistoryList = await this.prisma.priceHistory.findMany({
      where,
      orderBy,
      ...GetSkipAndPage(page, limit),
      include: {
        product: {
          include: {
            category: includeStatus,
            reviews: includeStatus,
          },
        },
      },
    });
    const totalCount = await this.prisma.priceHistory.count({ where });
    return {
      page,
      limit,
      totalCount,
      resultCount: priceHistoryList.length,
      result: priceHistoryList,
    };
  }

  async create(dto: priceHistoryDto, includeStatus: boolean = true) {
    const { productId, ...data } = dto;

    const percentageChange = GetPercentageChange(data.newPrice, data.oldPrice);
    const priceChange = data.oldPrice - data.newPrice;
    // Добавляем `percentageChange` в объект данных

    return this.prisma.priceHistory.create({
      data: {
        ...data,
        percentageChange,
        priceChange,
        product: {
          connect: {
            id: productId,
          },
        },
      },
      include: {
        product: {
          include: {
            category: includeStatus,
            reviews: includeStatus,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.priceHistory.delete({
      where: { id },
    });
  }
}
