import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { AdminBannersController } from './admin-banners.controller';
import { BannerCronService } from './banners-cron.service';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  providers: [BannersService, PrismaService, S3Service, BannerCronService],
  controllers: [BannersController, AdminBannersController],
})
export class BannersModule {}
