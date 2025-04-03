import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductsModule } from 'src/products/products.module';
import { S3Service } from 'src/s3.service';
import { AdminPromotionsProductsController } from './admin-promotions-products.controller';
import { AdminPromotionsController } from './admin-promotions.controller';
import { PromotionsProductsController } from './promotions-products.controller';
import { PromotionsProductsService } from './promotions-products.service';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

@Module({
  imports: [ProductsModule],
  providers: [
    PromotionsService,
    PromotionsProductsService,
    PrismaService,
    S3Service,
  ],
  controllers: [
    PromotionsController,
    AdminPromotionsController,
    AdminPromotionsProductsController,
    PromotionsProductsController,
  ],
})
export class PromotionsModule {}
