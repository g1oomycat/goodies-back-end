import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { PrismaService } from 'src/prisma.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [OrdersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService],
})
export class ReviewsModule {}
