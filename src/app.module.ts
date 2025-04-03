import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';

import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import s3Config from './config/s3.config';

import { BannersModule } from './banners/banners.module';
import { FavoritesModule } from './favorites/favorites.module';
import { OrdersModule } from './orders/orders.module';
import { PriceHistoryModule } from './price-history/price-history.module';
import { ProductsModule } from './products/products.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsInstagramModule } from './reviews-instagram/reviews-instagram.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [s3Config],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    OrdersModule,
    CategoriesModule,
    ProductsModule,
    PriceHistoryModule,
    UploadsModule,
    CartModule,
    // ReviewsModule,
    ReviewsInstagramModule,
    FavoritesModule,
    BannersModule,
    PromotionsModule,
  ],
})
export class AppModule {}
