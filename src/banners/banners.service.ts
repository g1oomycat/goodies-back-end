import { Injectable, NotFoundException } from '@nestjs/common';
import { Banner, Prisma } from '@prisma/client';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { IParamsSort } from 'src/common/types/sort';
import { GetSkipAndPage } from 'src/common/utils/get-skip-and-take';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ISortBanners } from './types/sort';

@Injectable()
export class BannersService {
  constructor(
    private prisma: PrismaService,
    private S3Service: S3Service,
  ) {}

  async getAll(
    title?: string,
    isActive?: boolean,
    sortBy?: ISortBanners,
    sort?: IParamsSort,
    limit?: number,
    page?: number,
  ) {
    const where: Prisma.BannerWhereInput = {
      ...(typeof isActive === 'boolean'
        ? { isActive: { equals: isActive } }
        : {}),
      ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
    };

    const orderBy = sortBy ? { [sortBy]: sort } : {};

    const totalCount = await this.prisma.banner.count({
      where,
    });

    const result = await this.prisma.banner.findMany({
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
    const banner = await this.prisma.banner.findUnique({
      where: {
        id,
      },
    });
    if (!banner) throw new NotFoundException('Товар не найден');
    return banner;
  }

  async create(dto: CreateBannerDto) {
    const now = new Date();
    let isActive: boolean = true;
    let { position, ...data } = dto;

    if (data.startDate && new Date(data.startDate) >= now) isActive = false;
    if (data.endDate && new Date(data.endDate) <= now) isActive = false;

    try {
      if (!position) {
        const lastCategory = await this.prisma.banner.findFirst({
          orderBy: { position: 'desc' },
          select: {
            position: true,
          },
        });

        position = lastCategory ? lastCategory.position + 1 : 0;
      }

      return this.prisma.banner.create({
        data: {
          ...data,
          position,
          isActive,
        },
      });
    } catch (error) {
      try {
        await this.S3Service.deleteFileByUrlBulk([
          data.imageLG,
          data.imageMD,
          data.imageSM,
        ]);
      } catch (error) {}

      throw error;
    }
  }
  async update(dto: UpdateBannerDto, id: string) {
    const now = new Date();
    let currentBanner: Banner | null = null;
    try {
      currentBanner = await this.getOne(id);

      let isActive: boolean = dto.isActive ?? currentBanner.isActive;

      if (dto.startDate && new Date(dto.startDate) >= now) isActive = false;
      if (dto.endDate && new Date(dto.endDate) <= now) isActive = false;

      const updatedBanner = await this.prisma.banner.update({
        where: {
          id,
        },
        data: {
          ...dto,
          isActive,
        },
      });
      const imagesToDelete = [
        dto.imageLG !== undefined && dto.imageLG !== currentBanner.imageLG
          ? currentBanner.imageLG
          : null,
        dto.imageMD !== undefined && dto.imageMD !== currentBanner.imageMD
          ? currentBanner.imageMD
          : null,
        dto.imageSM !== undefined && dto.imageSM !== currentBanner.imageSM
          ? currentBanner.imageSM
          : null,
      ].filter(Boolean); // Убираем null из массива

      if (imagesToDelete.length) {
        await this.S3Service.deleteFileByUrlBulk(imagesToDelete);
      }

      return updatedBanner;
    } catch (error) {
      if (dto.imageLG || dto.imageMD || dto.imageSM) {
        try {
          if (currentBanner) {
            const imagesToDelete = [
              dto.imageLG !== currentBanner.imageLG
                ? (dto.imageLG ?? null)
                : null,
              dto.imageMD !== currentBanner.imageMD
                ? (dto.imageMD ?? null)
                : null,
              dto.imageSM !== currentBanner.imageSM
                ? (dto.imageSM ?? null)
                : null,
            ].filter(Boolean); // Убираем null из массива

            if (imagesToDelete.length) {
              await this.S3Service.deleteFileByUrlBulk(imagesToDelete);
            }
          } else {
            const imagesToDelete = [
              dto?.imageLG ?? null,
              dto?.imageMD ?? null,
              dto?.imageSM ?? null,
            ].filter(Boolean); // Убираем null из массива
            if (imagesToDelete.length) {
              await this.S3Service.deleteFileByUrlBulk(imagesToDelete);
            }
          }
        } catch (error) {
          console.error('Ошибка при удалении загруженных изображений:', error);
        }
      }
      throw error;
    }
  }
  async delete(id: string) {
    const { imageLG, imageMD, imageSM } = await this.getOne(id);
    const deletedBanner = await this.prisma.banner.delete({
      where: {
        id,
      },
    });
    await this.S3Service.deleteFileByUrlBulk([imageLG, imageMD, imageSM]);
    return deletedBanner;
  }
  async deleteBulk({ ids }: DeleteBulkDto) {
    // Получаем изображения до удаления
    const bannersImages = await this.prisma.banner.findMany({
      where: { id: { in: ids } },
      select: { imageLG: true, imageMD: true, imageSM: true },
    });
    if (bannersImages.length !== ids.length) {
      throw new NotFoundException('Некоторые баннеры не найдены');
    }
    const images = bannersImages.flatMap((el) => [
      el.imageLG,
      el.imageMD,
      el.imageSM,
    ]);
    // Сначала удаляем файлы в S3
    await this.S3Service.deleteFileByUrlBulk(images);

    // Потом удаляем
    return this.prisma.banner.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
