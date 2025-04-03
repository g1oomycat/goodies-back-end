import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, Products } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { GetPercentageChange } from 'src/common/utils/get-percentage-change';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { PriceHistoryService } from 'src/price-history/price-history.service';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { slugify } from '../common/utils/slugify';
import {
  CreateProductDto,
  ProductAttributesType,
} from './dto/create-product.dto';

import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { UpdateProductMetricsDto } from './dto/update-product-metrics.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ISortProducts } from './types/sort';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private priceHistoryService: PriceHistoryService,
    private S3Service: S3Service,
  ) {}

  async getAll(
    categoryId?: string,
    sortBy?: ISortProducts,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
    isLowStock: boolean = true,
    includeStatus: boolean = true,
    whereExtra: Prisma.ProductsWhereInput = {},
    name?: string,
  ) {
    const where: Prisma.ProductsWhereInput = {
      ...(categoryId ? { categoryId } : {}),
      ...whereExtra, // Включаем дополнительные условия
      ...(isLowStock ? { stock: { gt: 0 } } : {}),
      ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
    };

    const orderBy = sortBy ? { [sortBy]: sort } : {};

    const totalCount = await this.prisma.products.count({
      where,
    });

    const result = await this.prisma.products.findMany({
      where,
      orderBy,
      ...GetSkipAndPage(page, limit),
      include: {
        reviews: includeStatus,
        category: includeStatus,
        attributes: includeStatus,
      },
    });
    return {
      page,
      limit,
      totalCount, // Возвращаем общее количество продуктов
      totalResult: result.length,
      result, // Возвращаем сами продукты
    };
  }

  async getOne(
    uniqValue: string,
    identifier: 'id' | 'slug',
    includeStatus: boolean = true,
  ) {
    const product = await this.prisma.products.findFirst({
      where: {
        [identifier]: uniqValue,
      },
      include: {
        reviews: includeStatus,

        category: includeStatus,
        attributes: includeStatus,
      },
    });

    if (!product) throw new NotFoundException('Товар не найден');
    return product;
  }

  async create(dto: CreateProductDto) {
    const { categoryId, attributes, ...data } = dto;
    const slug = slugify(dto.name);

    try {
      const resBySlugProduct = await this.prisma.products.findUnique({
        where: { slug },
      });
      if (resBySlugProduct) {
        throw new ConflictException(
          `Товар с таким slug: ${slug} уже существует`,
        );
      }
      return this.prisma.products.create({
        data: {
          ...data,
          slug,
          category: {
            connect: {
              id: categoryId,
            },
          },
          attributes: {
            create: dto.attributes.map((attr) => ({
              value: String(attr.value),
              title: attr.title,
              categoryAttribute: {
                connect: {
                  id: attr.categoryAttributeId,
                },
              },
            })),
          },
        },
        include: {
          reviews: true,
          category: true,
          attributes: { include: { categoryAttribute: true } },
        },
      });
    } catch (error) {
      if (data.images.length) {
        // Проверяем, есть ли вообще загруженные файлы
        try {
          await this.S3Service.deleteFileByUrlBulk(data.images);
        } catch (deleteError) {
          console.error(
            'Ошибка при удалении загруженных изображений:',
            deleteError,
          );
        }
      }
      throw error;
    }
  }

  async update(dto: UpdateProductDto, id: string) {
    const { attributes, categoryId, ...data } = dto;
    let currentProduct: Products | null = null;
    try {
      // Получаем текущий товар, если товар не найден, выбрасывается ошибка
      currentProduct = await this.getOne(id, 'id', false);

      if (categoryId && categoryId !== currentProduct.categoryId) {
        data['category'] = { connect: { id: categoryId } };
      }
      // Проверяем, изменилось ли имя, чтобы обновить slug
      if (data.name && data.name !== currentProduct.name) {
        const slug = slugify(data.name);
        const resBySlugProduct = await this.prisma.products.findUnique({
          where: { slug },
        });
        if (resBySlugProduct) {
          throw new ConflictException(
            `Товар с таким slug: ${slug} уже существует`,
          );
        }
        data['slug'] = slug;
      }

      const product = await this.prisma.$transaction(async (prisma) => {
        // создание истории изменение цен, если цена изменилась
        let { percentageChange, discount, updatedPriceAt, oldPrice } =
          currentProduct;
        if (data.price && data.price !== currentProduct.price) {
          oldPrice = currentProduct.price;
          percentageChange = GetPercentageChange(data.price, oldPrice);
          const priceChange = oldPrice - data.price;
          discount = priceChange > 0 ? priceChange : 0;
          updatedPriceAt = new Date();
          await prisma.priceHistory.create({
            data: {
              newPrice: data.price,
              oldPrice: oldPrice,
              percentageChange,
              priceChange,
              product: {
                connect: {
                  id,
                },
              },
            },
          });
        }
        //обновляем товар
        await prisma.products.update({
          where: { id },
          data: {
            ...data,
            oldPrice,
            discount,
            percentageChange,
            updatedPriceAt,
          },
        });
        //Обновляем атрибуты
        if (attributes) {
          await this.updateProductAttributes(prisma, id, attributes);
        }
        //получаем обновленный товар
        return prisma.products.findUnique({
          where: { id },
          include: {
            reviews: true,
            category: true,
            attributes: true,
          },
        });
      });
      // Удаляем старые изображения, если они не используются
      if (Array.isArray(data.images) && Array.isArray(currentProduct.images)) {
        const imagesForDelete = currentProduct.images.filter(
          (img) => !data.images.includes(img),
        );
        if (imagesForDelete.length) {
          await this.S3Service.deleteFileByUrlBulk(imagesForDelete);
        }
      }

      return product;
    } catch (error) {
      // Проверяем, есть ли вообще загруженные файлы
      if (Array.isArray(data.images) && data.images.length) {
        try {
          if (currentProduct) {
            // Удаляем только **новые загруженные**, но не старые фото
            const imagesForDelete = data.images.filter(
              (img) => !currentProduct.images.includes(img),
            );
            if (imagesForDelete.length) {
              await this.S3Service.deleteFileByUrlBulk(imagesForDelete);
            }
          } else {
            // Если `currentProduct` не загрузился, удаляем **все** новые изображения
            await this.S3Service.deleteFileByUrlBulk(data.images);
          }
        } catch (deleteError) {
          console.error(
            'Ошибка при удалении загруженных изображений:',
            deleteError,
          );
        }
      }
      throw error;
    }
  }

  async delete(id: string) {
    const product = await this.getOne(id, 'id', false);
    const deletedProduct = await this.prisma.products.delete({
      where: {
        id,
      },
    });
    await this.S3Service.deleteFileByUrlBulk(product.images);
    return deletedProduct;
  }

  async deleteBulk({ ids }: DeleteBulkDto) {
    // Получаем изображения до удаления продуктов
    const productsImages = await this.prisma.products.findMany({
      where: { id: { in: ids } },
      select: { images: true },
    });
    if (productsImages.length !== ids.length) {
      throw new NotFoundException('Некоторые товары не найдены');
    }
    const images = productsImages.flatMap((el) => el.images);
    // Сначала удаляем файлы в S3
    await this.S3Service.deleteFileByUrlBulk(images);

    // Потом удаляем продукты
    return this.prisma.products.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async updateProductMetrics(id: string, dto: UpdateProductMetricsDto) {
    return this.prisma.products.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
  private async updateProductAttributes(
    prisma: Prisma.TransactionClient,
    productId: string,
    attributes: ProductAttributesType[],
  ) {
    // Получение текущих атрибутов продукта
    const existingAttributes = await prisma.productAttributes.findMany({
      where: { productId },
    });

    const toCreate = attributes.filter(
      (attr) =>
        !existingAttributes.some(
          (ex) => ex.categoryAttributeId === attr.categoryAttributeId,
        ),
    );

    const toUpdate = attributes.filter((attr) =>
      existingAttributes.some(
        (ex) => ex.categoryAttributeId === attr.categoryAttributeId,
      ),
    );

    const toDelete = existingAttributes.filter(
      (ex) =>
        !attributes.some(
          (attr) => attr.categoryAttributeId === ex.categoryAttributeId,
        ),
    );
    // Удаление отсутствующих атрибутов
    if (toDelete.length > 0) {
      await prisma.productAttributes.deleteMany({
        where: {
          id: { in: toDelete.map((attr) => attr.id) },
        },
      });
    }

    // Добавление новых атрибутов
    if (toCreate.length > 0) {
      await prisma.productAttributes.createMany({
        data: toCreate.map((attr) => ({
          value: String(attr.value),
          title: attr.title,
          categoryAttributeId: attr.categoryAttributeId,
          productId,
        })),
      });
    }

    // Обновление существующих атрибутов
    for (const attr of toUpdate) {
      const existingAttr = existingAttributes.find(
        (ex) => ex.categoryAttributeId === attr.categoryAttributeId,
      );
      if (existingAttr) {
        await prisma.productAttributes.update({
          where: { id: existingAttr.id },
          data: { value: String(attr.value) },
        });
      }
    }
  }
}
