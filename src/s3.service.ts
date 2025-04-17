import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('s3.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKeyId'),
        secretAccessKey: this.configService.get<string>('s3.secretAccessKey'),
      },
    });
    this.bucketName = this.configService.get<string>('s3.bucketName');
  }

  /**
   * Загрузка одного файла в S3
   */
  async uploadFile(
    fileBuffer: Buffer,
    mimetype: string,
    fileName: string,
    entityType?: string, // Категория файла (products, categories, banners и т.д.)
  ): Promise<string> {
    try {
      // Определяем путь внутри S3
      const folder = entityType ? `${entityType}/` : ''; // Например: "products/"
      const fileKey = `${folder}${fileName.replace(/\s+/g, '_')}`; // Полный путь: "products/image.webp"

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: fileKey, // Загружаем с папкой
          Body: fileBuffer,
          ContentType: mimetype,
        },
      });

      await upload.done();
      return this.getFileUrl(fileKey); // Возвращаем URL с учетом папки
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException('Ошибка загрузки файла в S3');
    }
  }

  /**
   * Загрузка нескольких файлов в S3
   */
  async uploadFilesBulk(
    files: { buffer: Buffer; mimetype: string; fileName: string }[],
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadFile(file.buffer, file.mimetype, file.fileName),
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('S3 Multi-Upload Error:', error);
      throw new InternalServerErrorException('Ошибка загрузки файлов в S3');
    }
  }

  /**
   * Удаление файла из S3
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      );
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw new InternalServerErrorException('Ошибка удаления файла в S3');
    }
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    try {
      // Парсим URL и извлекаем `Key`
      const url = new URL(fileUrl);
      const key = decodeURIComponent(url.pathname.substring(1)); // убираем первый "/"

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      console.log(`Файл ${key}:${this.bucketName} успешно удален из S3`);
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw new InternalServerErrorException('Ошибка удаления файла в S3');
    }
  }
  async deleteFileByUrlBulk(filesUrl: string[]): Promise<void[]> {
    try {
      const deletePromises = filesUrl.map((file) => this.deleteFileByUrl(file));
      return await Promise.all(deletePromises);
    } catch (error) {
      console.error('S3 Multi-Delete Error:', error);
      throw new InternalServerErrorException('Ошибка удаления файлов в S3');
    }
  }
  /**
   * Генерация URL для файла в S3
   */
  getFileUrl(fileName: string): string {
    return `https://${this.bucketName}.s3.${this.configService.get<string>('s3.region')}.amazonaws.com/${fileName}`;
  }
}
