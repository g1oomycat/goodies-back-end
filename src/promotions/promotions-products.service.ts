import { Injectable } from '@nestjs/common';
import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';

import { DeletePromotionProductsDto } from './dto/promotion-products/delete-promotion.dto';
import { CreatePromotionProductsDto } from './dto/promotion/create-promotion-products.dto';
import { ISortPromotionsProducts } from './types/sort';

@Injectable()
export class PromotionsProductsService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async getAll(
    promoId: string,
    sortBy?: ISortPromotionsProducts,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
    isLowStock: boolean = true,
  ) {
    const promoProducts = await this.prisma.promoProducts.findMany({
      where: { promoId },
      select: { productId: true },
    });
    const productIds = promoProducts.map(
      (promoProduct) => promoProduct.productId,
    );

    if (productIds.length === 0) {
      return { page, limit, totalCount: 0, resultCount: 0, result: [] };
    }
    // Используем ProductsService для получения товаров по их ID
    const sortedProducts = await this.productsService.getAll(
      undefined, // categoryId (не фильтруем по категории)
      sortBy,
      sort,
      limit,
      page,
      isLowStock,
      true,
      { id: { in: productIds } }, // Фильтрация товаров по ID
    );
    return {
      page,
      limit,
      totalCount: sortedProducts.totalCount,
      totalResult: sortedProducts.result.length,
      result: sortedProducts,
    };
  }

  async addProducts(dto: CreatePromotionProductsDto[]) {
    return this.prisma.promoProducts.createMany({
      data: dto.map(({ productId, promoId }) => ({
        productId,
        promoId,
      })),
      skipDuplicates: true,
    });
  }

  async deleteProducts(dto: DeletePromotionProductsDto[]) {
    return this.prisma.promoProducts.deleteMany({
      where: {
        OR: dto.map(({ productId, promoId }) => ({
          productId,
          promoId,
        })),
      },
    });
  }
}
