import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BannerCronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *', { timeZone: 'Asia/Yekaterinburg' }) // Каждый день в 00:00
  async updateBannerStatus() {
    const now = new Date();

    // Отключаем баннеры, у которых endDate в прошлом
    await this.prisma.banner.updateMany({
      where: {
        endDate: { lte: now }, // Если endDate <= текущей даты
        isActive: true, // Только если баннер активен
      },
      data: { isActive: false },
    });

    // Включаем баннеры, у которых startDate наступила
    await this.prisma.banner.updateMany({
      where: {
        startDate: { lte: now }, // Если startDate <= текущей даты
        isActive: false, // Только если баннер не активен
      },
      data: { isActive: true },
    });

    console.log('CRON: Баннеры обновлены', now.toLocaleString());
  }
}
