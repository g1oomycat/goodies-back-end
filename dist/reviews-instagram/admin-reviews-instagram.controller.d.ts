import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { CreateReviewInstagramDto } from './dto/create-reviews-instagram.dto';
import { UpdateReviewsInstagramDto } from './dto/update-reviews-instagram.dto';
import { ReviewsInstagramService } from './reviews-instagram.service';
export declare class AdminReviewsInstagramController {
    private readonly reviewsInstagramService;
    constructor(reviewsInstagramService: ReviewsInstagramService);
    getOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string;
        isActive: boolean;
        position: number;
        nick: string;
    }>;
    create(dto: CreateReviewInstagramDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string;
        isActive: boolean;
        position: number;
        nick: string;
    }>;
    update(dto: UpdateReviewsInstagramDto, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string;
        isActive: boolean;
        position: number;
        nick: string;
    }>;
    deleteBulk(dto: DeleteBulkDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string;
        isActive: boolean;
        position: number;
        nick: string;
    }>;
}
