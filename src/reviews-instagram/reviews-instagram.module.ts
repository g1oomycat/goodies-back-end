import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { AdminReviewsInstagramController } from './admin-reviews-instagram.controller';
import { ReviewsInstagramController } from './reviews-instagram.controller';
import { ReviewsInstagramService } from './reviews-instagram.service';

@Module({
  providers: [ReviewsInstagramService, PrismaService, S3Service],
  controllers: [ReviewsInstagramController, AdminReviewsInstagramController],
})
export class ReviewsInstagramModule {}
