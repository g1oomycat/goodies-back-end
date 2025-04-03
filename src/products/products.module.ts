import { Module } from '@nestjs/common';
import { PriceHistoryModule } from 'src/price-history/price-history.module';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { AdminProductsController } from './admin-products.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [PriceHistoryModule],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService, PrismaService, S3Service],
  exports: [ProductsService],
})
export class ProductsModule {}
