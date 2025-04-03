import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { CreatePromotionDto } from './dto/promotion-products/create-promotion.dto';
import { UpdatePromotionDto } from './dto/promotion/update-promotion-products.dto';
import { ISortPromotions } from './types/sort';
export declare class PromotionsService {
    private prisma;
    private S3Service;
    constructor(prisma: PrismaService, S3Service: S3Service);
    getAll(sortBy?: ISortPromotions, sort?: IParamsSort, limit?: number, page?: number, isActive?: boolean): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            image: string;
            title: string;
            link: string | null;
            startDate: Date | null;
            endDate: Date | null;
            isActive: boolean;
            content: string | null;
        }[];
    }>;
    getOne(uniqValue: string, identifier: 'id' | 'slug'): Promise<{
        products: {
            productId: string;
            promoId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        image: string;
        title: string;
        link: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isActive: boolean;
        content: string | null;
    }>;
    create(dto: CreatePromotionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        image: string;
        title: string;
        link: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isActive: boolean;
        content: string | null;
    }>;
    update(dto: UpdatePromotionDto, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        image: string;
        title: string;
        link: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isActive: boolean;
        content: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        image: string;
        title: string;
        link: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isActive: boolean;
        content: string | null;
    }>;
}
