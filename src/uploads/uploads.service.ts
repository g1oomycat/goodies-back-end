import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { v4 as uuid } from 'uuid';
import { imageConfig } from './lib/constants/image-config';
import { IEntityType } from './types/entity-type';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  // async findAll(productId?: string) {
  //   const where: Prisma.ProductImagesWhereInput = {};
  //   if (productId) {
  //     where.productId = productId;
  //   }

  //   return this.prisma.productImages.findMany({
  //     where,
  //   });
  // }

  // async findOne(id: string) {
  //   return this.prisma.productImages.findUnique({
  //     where: { id },
  //   });
  // }

  /**
   * Основной метод загрузки изображений
   */
  async uploadImages(
    entityType: IEntityType,
    files: Express.Multer.File[],
  ): Promise<{ url: string; fileName: string }[]> {
    const config = imageConfig[entityType];

    if (!config) {
      throw new BadRequestException('Неверный тип сущности');
    }

    if (files.length > config.maxCount) {
      throw new BadRequestException(
        `Максимальное количество файлов: ${config.maxCount}`,
      );
    }

    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    const processedImages = [];

    try {
      for (const file of files) {
        const originalName = file.originalname.split('.');
        originalName.pop();
        const fileName = `${uuid()}-${originalName.join('.')}.webp`;
        const outputPath = path.join('uploads', fileName);

        // Обрабатываем и сжимаем изображение
        const sharpInstance = sharp(file.path);
        if (config.width > 0 && config.height > 0) {
          sharpInstance.resize(config.width, config.height);
        }
        const effort =
          entityType === 'bannersLG' ||
          entityType === 'bannersMD' ||
          entityType === 'bannersSM'
            ? 6
            : 3;
        console.log(effort);

        await sharpInstance
          .webp({ effort, quality: effort === 6 ? 90 : 80 })
          .toFile(outputPath);

        // Загружаем в S3
        const fileBuffer = fs.readFileSync(outputPath);
        const uploadedUrl = await this.s3Service.uploadFile(
          fileBuffer,
          'image/webp',
          fileName,
          entityType,
        );

        // Удаляем локальный файл
        fs.unlinkSync(outputPath);

        processedImages.push({ url: uploadedUrl, fileName });
      }

      return processedImages;
    } catch (error) {
      console.error('Image Upload Error:', error);
      throw new InternalServerErrorException('Ошибка обработки изображений');
    }
  }
  // async deleteByUrlBulk(urls: string[]) {
  //   try {
  //     await this.s3Service.deleteFiles(urls);
  //   } catch (error) {
  //     console.error('Ошибка удаления файлов из S3:', error);
  //   }
  // }

  // async delete(id: string) {
  //   const image = await this.findOne(id);
  //   if (!image) {
  //     throw new InternalServerErrorException('Фотография не найдена');
  //   }
  //   const transaction = await this.prisma.$transaction([
  //     this.prisma.productImages.delete({
  //       where: { id },
  //     }),
  //   ]);
  //   try {
  //     const fileKey = this.extractFileKeyFromUrl(image.url);
  //     await this.s3Service.deleteFile(fileKey);
  //   } catch (error) {
  //     await this.prisma.$executeRaw`ROLLBACK`;
  //     throw new InternalServerErrorException(
  //       'Ошибка удаления файла в хранилище S3',
  //     );
  //   }
  //   return transaction[0];
  // }

  // async deleteBulk(listId: string[]) {
  //   const deleteImagesFromS3 = async (images) => {
  //     for (const image of images) {
  //       const fileKey = this.extractFileKeyFromUrl(image.url);
  //       await this.s3Service.deleteFile(fileKey);
  //     }
  //   };
  //   try {
  //     const images = await this.prisma.productImages.findMany({
  //       where: {
  //         id: {
  //           in: listId,
  //         },
  //       },
  //     });

  //     if (images.length !== listId.length) {
  //       throw new InternalServerErrorException(
  //         'Некоторые фотографии не найдены',
  //       );
  //     }

  //     await deleteImagesFromS3(images);

  //     const deleteResult = await this.prisma.productImages.deleteMany({
  //       where: {
  //         id: {
  //           in: listId,
  //         },
  //       },
  //     });

  //     return deleteResult;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Ошибка удаления файла в хранилище S3 или базе данных',
  //     );
  //   }
  // }

  // private extractFileKeyFromUrl(url: string): string {
  //   const urlParts = url.split('/');
  //   return urlParts[urlParts.length - 1];
  // }

  // private async deleteByUrlBulk(urlList: string[]) {
  //   for (const url of urlList) {
  //     const fileKey = this.extractFileKeyFromUrl(url);
  //     await this.s3Service.deleteFile(fileKey);
  //   }
  // }
}
