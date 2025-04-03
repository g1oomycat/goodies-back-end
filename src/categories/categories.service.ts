import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Categories, Prisma } from '@prisma/client';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { IParamsSort } from 'src/common/types/sort';
import { capitalizeFirstLetter } from 'src/common/utils/capitalize-first-letter';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { slugify } from 'src/common/utils/slugify';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { CreateCategoryAttributeDto } from './dto/category-attribute/create.dto';
import { CreateCategoryDto } from './dto/category/create.dto';
import { UpdateCategoryDto } from './dto/category/update.dto';
import { ISortCategories } from './types';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private S3Service: S3Service,
  ) {}

  async getAll(
    name?: string,
    sortBy?: ISortCategories,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
  ) {
    const where: Prisma.CategoriesWhereInput = {
      ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
    };
    const orderBy = sortBy
      ? sortBy === 'countProduct'
        ? { products: { _count: sort } }
        : { [sortBy]: sort }
      : {};
    const categoriesList = await this.prisma.categories.findMany({
      orderBy: orderBy,
      where,
      include: {
        _count: {
          select: { products: true }, // Получаем количество товаров
        },
        attributes: true,
      },
      ...GetSkipAndPage(page, limit),
    });
    const totalCount = await this.prisma.categories.count({
      where,
    });
    return {
      page,
      limit,
      totalCount,
      resultCount: categoriesList.length,
      result: categoriesList,
    };
  }

  async getOne(
    uniqValue: string,
    identifier: 'id' | 'slug',
    includeAttributes: boolean = true,
  ) {
    const categories = await this.prisma.categories.findFirst({
      where: {
        [identifier]: uniqValue,
      },
      include: {
        _count: {
          select: { products: true }, // Получаем количество товаров
        },
        attributes: includeAttributes,
      },
    });

    if (!categories) throw new NotFoundException('Категория не найдена');
    return categories;
  }

  async create(dto: CreateCategoryDto) {
    const { attributes, ...data } = dto;

    const slug = slugify(dto.name);
    try {
      const isCategories = await this.prisma.categories.findUnique({
        where: {
          slug,
        },
      });
      if (isCategories)
        throw new ConflictException(
          `Категория с таким slug: ${slug} уже существует`,
        );
      const lastCategory = await this.prisma.categories.findFirst({
        orderBy: { numberSort: 'desc' },
        select: {
          numberSort: true,
        },
      });
      const numberSort = lastCategory ? lastCategory.numberSort + 1 : 0;
      return this.prisma.categories.create({
        data: {
          ...data,
          slug,
          numberSort,
          attributes: attributes
            ? {
                create: attributes.map((attr) => ({
                  name: attr.name,
                  type: attr.type,
                  filterable: attr.filterable ?? true,
                  options: attr.options,
                })),
              }
            : undefined,
        },
        include: {
          _count: {
            select: { products: true }, // Получаем количество товаров
          },
          attributes: true,
        },
      });
    } catch (error) {
      try {
        await this.S3Service.deleteFileByUrl(data.image);
      } catch (deleteError) {
        console.error(
          'Ошибка при удалении загруженных изображений:',
          deleteError,
        );
      }

      throw error;
    }
  }

  async update(dto: UpdateCategoryDto, id: string) {
    const { attributes, ...data } = dto;
    let currentCategory: Categories | null = null;
    try {
      currentCategory = await this.getOne(id, 'id', false);

      if (data.name && data.name !== currentCategory.name) {
        const slug = slugify(data.name);
        const category = await this.prisma.categories.findUnique({
          where: { id },
        });

        if (!category)
          throw new ConflictException(
            `Категория с таким slug:${slug} уже существует`,
          );
        data['slug'] = slug;
        data.name = capitalizeFirstLetter(data.name);
      }
      const category = await this.prisma.$transaction(async (prisma) => {
        if (attributes) {
          await this.updateCategoryAttributes(prisma, id, attributes);
        }

        return prisma.categories.update({
          where: { id },
          data,
          include: {
            _count: {
              select: { products: true }, // Получаем количество товаров
            },
            attributes: true,
          },
        });
      });
      if (data.image && data.image !== currentCategory.image) {
        await this.S3Service.deleteFileByUrl(currentCategory.image);
      }
      return category;
    } catch (error) {
      if (data.image) {
        try {
          if (currentCategory.image) {
            // Удаляем только **новые загруженные**, но не старые фото
            if (currentCategory.image !== data.image)
              await this.S3Service.deleteFileByUrl(data.image);
          } else {
            // Если `currentCategory` не загрузился, удаляем **все** новые изображения

            await this.S3Service.deleteFileByUrl(data.image);
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
    const currentCategory = await this.getOne(id, 'id', false);
    const deletedCategory = await this.prisma.categories.delete({
      where: {
        id,
      },
    });
    await this.S3Service.deleteFileByUrl(currentCategory.image);
    return deletedCategory;
  }
  async deleteBulk({ ids }: DeleteBulkDto) {
    // Получаем изображения до удаления
    const categoriesImages = await this.prisma.categories.findMany({
      where: { id: { in: ids } },
      select: { image: true },
    });
    if (categoriesImages.length !== ids.length) {
      throw new NotFoundException('Некоторые категории не найдены');
    }
    const images = categoriesImages.map((el) => el.image);
    // Сначала удаляем файлы в S3
    await this.S3Service.deleteFileByUrlBulk(images);

    // Потом удаляем
    return this.prisma.products.deleteMany({
      where: { id: { in: ids } },
    });
  }

  private async updateCategoryAttributes(
    prisma: Prisma.TransactionClient,
    categoryId: string,
    attributes: CreateCategoryAttributeDto[],
  ) {
    // Получение текущих атрибутов категории
    const existingAttributes = await prisma.categoryAttributes.findMany({
      where: { categoryId },
    });

    // Разделение атрибутов на категории
    const toCreate = attributes.filter(
      (attr) => !existingAttributes.some((ex) => ex.name === attr.name),
    );

    const toUpdate = attributes.filter((attr) =>
      existingAttributes.some((ex) => ex.name === attr.name),
    );

    const toDelete = existingAttributes.filter(
      (ex) => !attributes.some((attr) => attr.name === ex.name),
    );

    // Удаление отсутствующих атрибутов
    if (toDelete.length > 0) {
      await prisma.categoryAttributes.deleteMany({
        where: {
          id: { in: toDelete.map((attr) => attr.id) },
        },
      });
    }

    // Добавление новых атрибутов
    if (toCreate.length > 0) {
      await prisma.categoryAttributes.createMany({
        data: toCreate.map((attr) => ({
          name: attr.name,
          type: attr.type,
          filterable: attr.filterable ?? true,
          options: attr.options,
          categoryId,
        })),
      });
    }

    // Обновление существующих атрибутов
    for (const attr of toUpdate) {
      const existingAttr = existingAttributes.find(
        (ex) => ex.name === attr.name,
      );
      if (existingAttr) {
        await prisma.categoryAttributes.update({
          where: { id: existingAttr.id },
          data: {
            name: attr.name,
            type: attr.type,
            filterable: attr.filterable ?? existingAttr.filterable,
            options: attr.options,
          },
        });
      }
    }
  }
}
