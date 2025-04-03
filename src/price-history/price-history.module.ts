import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AdminPriceHistoryController } from './price-history.controller';
import { PriceHistoryService } from './price-history.service';

@Module({
  controllers: [AdminPriceHistoryController],
  providers: [PriceHistoryService, PrismaService],
  exports: [PriceHistoryService],
})
export class PriceHistoryModule {}
