import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IParamsSort } from 'src/common/types/sort';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateFavoritesDto } from './dto/create-favorites.dto';
import { ISortFavorites } from './types/sort';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async getAll(
    userId: string,
    limit?: number,
    page?: number,
    sortBy?: ISortFavorites,
    sort?: IParamsSort,
    includeStatus: boolean = true,
  ) {
    const includeOptions = {
      product: {
        include: {
          reviews: includeStatus,
          category: includeStatus,
          attributes: includeStatus,
        },
      },
    };

    const totalCount = await this.prisma.favorites.count({
      where: { userId },
    });

    // Если нет пагинации, просто получаем все избранные товары
    if (!limit) {
      const favorites = await this.prisma.favorites.findMany({
        where: { userId },
        include: includeOptions,
      });

      return {
        page,
        limit: 0,
        totalCount,
        totalResult: favorites.length,
        result: favorites,
      };
    }

    // Если сортировка идет по дате добавления в избранное, сортируем по createdAt
    if (sortBy === 'createdAt') {
      const favorites = await this.prisma.favorites.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        ...GetSkipAndPage(page, limit),
        include: includeOptions,
      });

      return {
        page,
        limit,
        totalCount,
        totalResult: favorites.length,
        result: favorites,
      };
    }

    // Получаем список избранных товаров и их ID
    const favoriteProducts = await this.prisma.favorites.findMany({
      where: { userId },
    });
    const productIds = favoriteProducts.map((fav) => fav.productId);

    // Если нет товаров, сразу возвращаем пустой массив
    if (productIds.length === 0) {
      return { page, limit, totalCount, totalResult: 0, result: [] };
    }

    // Используем ProductsService для получения товаров по их ID
    const sortedProducts = await this.productsService.getAll(
      undefined, // categoryId (не фильтруем по категории)
      sortBy,
      sort,
      limit,
      page,
      true,
      true,
      { id: { in: productIds } }, // Фильтрация товаров по ID
    );

    // Привязываем товары к их избранным записям
    const sortedFavorites = sortedProducts.result
      .map((product) => {
        const fav = favoriteProducts.find(
          (fav) => fav.productId === product.id,
        );
        return fav ? { ...fav, product } : null;
      })
      .filter(Boolean); // Убираем `null` значения

    return {
      page,
      limit,
      totalCount,
      totalResult: sortedFavorites.length,
      result: sortedFavorites,
    };
  }

  async create(userId: string, dto: CreateFavoritesDto) {
    const listFavorites = await this.getAll(
      userId,
      undefined,
      undefined,
      undefined,
      undefined,
      false,
    );
    if (listFavorites.totalCount >= 99)
      throw new BadRequestException(
        'Максимальное количество товаров в избранном 99',
      );
    for (const item of listFavorites.result) {
      if (item.productId === dto.productId)
        throw new BadRequestException('Товар уже в избранном');
    }
    return this.prisma.favorites.create({
      data: {
        user: {
          connect: {
            id: userId,
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
            reviews: true,
            attributes: true,
          },
        },
      },
    });
  }

  async delete(userId: string, dto: CreateFavoritesDto) {
    const favorite = await this.prisma.favorites.findFirst({
      where: {
        userId,
        productId: dto.productId,
      },
      select: {
        id: true,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Товара нет в избранном');
    }
    return this.prisma.favorites.delete({
      where: {
        id: favorite.id,
      },
      include: {
        product: {
          include: {
            category: true,
            reviews: true,
            attributes: true,
          },
        },
      },
    });
  }
}
