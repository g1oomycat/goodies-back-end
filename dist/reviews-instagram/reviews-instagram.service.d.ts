import { Prisma } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { CreateReviewInstagramDto } from './dto/create-reviews-instagram.dto';
import { UpdateReviewsInstagramDto } from './dto/update-reviews-instagram.dto';
import { ISortReviewsInstagram } from './types/sort';
export declare class ReviewsInstagramService {
    private prisma;
    private S3Service;
    constructor(prisma: PrismaService, S3Service: S3Service);
    getAll(name?: string, nick?: string, isActive?: boolean, sortBy?: ISortReviewsInstagram, sort?: IParamsSort, limit?: number, page?: number): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string;
            isActive: boolean;
            position: number;
            nick: string;
        }[];
    }>;
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
    deleteBulk({ ids }: DeleteBulkDto): Promise<Prisma.BatchPayload>;
}
