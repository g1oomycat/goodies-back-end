import { Prisma } from '@prisma/client';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { CreateCategoryDto } from './dto/category/create.dto';
import { UpdateCategoryDto } from './dto/category/update.dto';
import { ISortCategories } from './types';
export declare class CategoriesService {
    private prisma;
    private S3Service;
    constructor(prisma: PrismaService, S3Service: S3Service);
    getAll(name?: string, sortBy?: ISortCategories, sort?: IParamsSort, limit?: number, page?: number): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        resultCount: number;
        result: ({
            _count: {
                products: number;
            };
            attributes: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.AttributeType;
                categoryId: string;
                filterable: boolean;
                options: string[];
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            image: string;
            numberSort: number;
        })[];
    }>;
    getOne(uniqValue: string, identifier: 'id' | 'slug', includeAttributes?: boolean): Promise<{
        _count: {
            products: number;
        };
        attributes: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.AttributeType;
            categoryId: string;
            filterable: boolean;
            options: string[];
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string;
        numberSort: number;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        _count: {
            products: number;
        };
        attributes: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.AttributeType;
            categoryId: string;
            filterable: boolean;
            options: string[];
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string;
        numberSort: number;
    }>;
    update(dto: UpdateCategoryDto, id: string): Promise<{
        _count: {
            products: number;
        };
        attributes: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.AttributeType;
            categoryId: string;
            filterable: boolean;
            options: string[];
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string;
        numberSort: number;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string;
        image: string;
        numberSort: number;
    }>;
    deleteBulk({ ids }: DeleteBulkDto): Promise<Prisma.BatchPayload>;
    private updateCategoryAttributes;
}
