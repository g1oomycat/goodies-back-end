import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReviewsInstagram } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';

import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { CreateReviewInstagramDto } from './dto/create-reviews-instagram.dto';
import { UpdateReviewsInstagramDto } from './dto/update-reviews-instagram.dto';
import { ISortReviewsInstagram } from './types/sort';

@Injectable()
export class ReviewsInstagramService {
  constructor(
    private prisma: PrismaService,
    private S3Service: S3Service,
  ) {}

  async getAll(
    name?: string,
    nick?: string,
    isActive?: boolean,
    sortBy?: ISortReviewsInstagram,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
  ) {
    console.log(isActive);

    const where: Prisma.ReviewsInstagramWhereInput = {
      ...(typeof isActive === 'boolean'
        ? { isActive: { equals: isActive } }
        : {}),
      ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
      ...(nick ? { nick: { contains: nick, mode: 'insensitive' } } : {}),
    };

    const orderBy = sortBy ? { [sortBy]: sort } : {};

    const totalCount = await this.prisma.reviewsInstagram.count({
      where,
    });

    const result = await this.prisma.reviewsInstagram.findMany({
      where,
      orderBy,
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

  async getOne(id: string) {
    const reviewsInstagram = await this.prisma.reviewsInstagram.findUnique({
      where: {
        id,
      },
    });
    if (!reviewsInstagram) throw new NotFoundException('Отзыв не найден');
    return reviewsInstagram;
  }

  async create(dto: CreateReviewInstagramDto) {
    let { position } = dto;
    try {
      if (!position) {
        const lastReviewInst = await this.prisma.reviewsInstagram.findFirst({
          orderBy: { position: 'desc' },
          select: {
            position: true,
          },
        });
        position = lastReviewInst ? lastReviewInst.position + 1 : 0;
      }
      return this.prisma.reviewsInstagram.create({
        data: {
          ...dto,
          position,
        },
      });
    } catch (error) {
      try {
        await this.S3Service.deleteFileByUrl(dto.image);
      } catch (error) {
        console.error('Ошибка при удалении загруженных изображений:', error);
      }
      throw error;
    }
  }
  async update(dto: UpdateReviewsInstagramDto, id: string) {
    let currentReviewInstagram: ReviewsInstagram | null = null;
    try {
      currentReviewInstagram = await this.getOne(id);
      const updatedReviewsInstagram = await this.prisma.reviewsInstagram.update(
        {
          where: {
            id,
          },
          data: {
            ...dto,
          },
        },
      );
      if (dto.image && dto.image !== currentReviewInstagram.image)
        await this.S3Service.deleteFileByUrl(currentReviewInstagram.image);
      return updatedReviewsInstagram;
    } catch (error) {
      if (dto.image) {
        try {
          if (currentReviewInstagram) {
            if (dto.image !== currentReviewInstagram.image) {
              await this.S3Service.deleteFileByUrl(dto.image);
            }
          } else {
            await this.S3Service.deleteFileByUrl(dto.image);
          }
        } catch (error) {
          console.error('Ошибка при удалении загруженных изображений:', error);
        }
      }
      throw error;
    }
  }
  async delete(id: string) {
    const { image } = await this.getOne(id);
    const deletedReviewsInstagram = await this.prisma.reviewsInstagram.delete({
      where: {
        id,
      },
    });
    await this.S3Service.deleteFileByUrl(image);
    return deletedReviewsInstagram;
  }
  async deleteBulk({ ids }: DeleteBulkDto) {
    // Получаем изображения до удаления продуктов
    const reviewsInstagramImages = await this.prisma.reviewsInstagram.findMany({
      where: { id: { in: ids } },
      select: { image: true },
    });
    if (reviewsInstagramImages.length !== ids.length) {
      throw new NotFoundException('Некоторые отзывы не найдены');
    }
    const images = reviewsInstagramImages.flatMap((el) => el.image);
    // Сначала удаляем файлы в S3
    await this.S3Service.deleteFileByUrlBulk(images);

    // Потом удаляем продукты
    return this.prisma.products.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
