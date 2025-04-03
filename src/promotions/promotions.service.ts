import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { slugify } from 'src/common/utils/slugify';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';

import { CreatePromotionDto } from './dto/promotion-products/create-promotion.dto';
import { UpdatePromotionDto } from './dto/promotion/update-promotion-products.dto';
import { ISortPromotions } from './types/sort';

@Injectable()
export class PromotionsService {
  constructor(
    private prisma: PrismaService,
    private S3Service: S3Service,
  ) {}

  async getAll(
    sortBy?: ISortPromotions,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
    isActive: boolean = true,
  ) {
    const whereClause: Prisma.PromoWhereInput = {
      ...(isActive ? { isActive: { equals: true } } : {}),
    };

    const orderByClause = sortBy ? { [sortBy]: sort } : {};

    const totalCount = await this.prisma.promo.count({
      where: whereClause,
    });

    const result = await this.prisma.promo.findMany({
      where: whereClause,
      orderBy: orderByClause,
      ...GetSkipAndPage(page, limit),
    });
    return {
      page,
      limit,
      totalCount, // Возвращаем общее количество продуктов
      totalResult: result.length,
      result, // Возвращаем сами продукты
    };
  }

  async getOne(uniqValue: string, identifier: 'id' | 'slug') {
    const promo = await this.prisma.promo.findFirst({
      where: {
        [identifier]: uniqValue,
      },
      include: {
        products: true,
      },
    });
    if (!promo) throw new NotFoundException('Акция не найдена');
    return promo;
  }

  async create(dto: CreatePromotionDto) {
    const slug = slugify(dto.title);
    const isProduct = await this.prisma.promo.findUnique({
      where: { slug },
    });
    if (isProduct)
      throw new ConflictException(`Акция с таким slug: ${slug} уже существует`);
    return this.prisma.promo.create({
      data: {
        ...dto,
        slug,
      },
    });
  }
  async update(dto: UpdatePromotionDto, id: string) {
    const { image } = await this.getOne(id, 'id');

    const updatedPromo = await this.prisma.promo.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });

    if (dto.image) await this.S3Service.deleteFileByUrl(image);

    return updatedPromo;
  }
  async delete(id: string) {
    const { image } = await this.getOne(id, 'id');
    const deletedPromo = await this.prisma.promo.delete({
      where: {
        id,
      },
    });
    await this.S3Service.deleteFileByUrl(image);
    return deletedPromo;
  }
}
