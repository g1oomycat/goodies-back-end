import { Prisma } from '@prisma/client';
import { IParamsSort } from 'src/common/types/sort';
import { PriceHistoryService } from 'src/price-history/price-history.service';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { UpdateProductMetricsDto } from './dto/update-product-metrics.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ISortProducts } from './types/sort';
export declare class ProductsService {
    private prisma;
    private priceHistoryService;
    private S3Service;
    constructor(prisma: PrismaService, priceHistoryService: PriceHistoryService, S3Service: S3Service);
    getAll(categoryId?: string, sortBy?: ISortProducts, sort?: IParamsSort, limit?: number, page?: number, isLowStock?: boolean, includeStatus?: boolean, whereExtra?: Prisma.ProductsWhereInput, name?: string): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: ({
            reviews: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                userId: string;
                comment: string | null;
                rating: number;
            }[];
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string;
                image: string;
                numberSort: number;
            };
            attributes: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                title: string;
                value: string;
                categoryAttributeId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            discount: number;
            slug: string;
            description: string;
            images: string[];
            stock: number;
            purchaseCount: number;
            ordersCount: number;
            price: number;
            oldPrice: number | null;
            percentageChange: number | null;
            updatedPriceAt: Date | null;
            categoryId: string;
        })[];
    }>;
    getOne(uniqValue: string, identifier: 'id' | 'slug', includeStatus?: boolean): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
            comment: string | null;
            rating: number;
        }[];
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            image: string;
            numberSort: number;
        };
        attributes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            title: string;
            value: string;
            categoryAttributeId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        discount: number;
        slug: string;
        description: string;
        images: string[];
        stock: number;
        purchaseCount: number;
        ordersCount: number;
        price: number;
        oldPrice: number | null;
        percentageChange: number | null;
        updatedPriceAt: Date | null;
        categoryId: string;
    }>;
    create(dto: CreateProductDto): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
            comment: string | null;
            rating: number;
        }[];
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            image: string;
            numberSort: number;
        };
        attributes: ({
            categoryAttribute: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.AttributeType;
                categoryId: string;
                filterable: boolean;
                options: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            title: string;
            value: string;
            categoryAttributeId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        discount: number;
        slug: string;
        description: string;
        images: string[];
        stock: number;
        purchaseCount: number;
        ordersCount: number;
        price: number;
        oldPrice: number | null;
        percentageChange: number | null;
        updatedPriceAt: Date | null;
        categoryId: string;
    }>;
    update(dto: UpdateProductDto, id: string): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
            comment: string | null;
            rating: number;
        }[];
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string;
            image: string;
            numberSort: number;
        };
        attributes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            title: string;
            value: string;
            categoryAttributeId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        discount: number;
        slug: string;
        description: string;
        images: string[];
        stock: number;
        purchaseCount: number;
        ordersCount: number;
        price: number;
        oldPrice: number | null;
        percentageChange: number | null;
        updatedPriceAt: Date | null;
        categoryId: string;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        discount: number;
        slug: string;
        description: string;
        images: string[];
        stock: number;
        purchaseCount: number;
        ordersCount: number;
        price: number;
        oldPrice: number | null;
        percentageChange: number | null;
        updatedPriceAt: Date | null;
        categoryId: string;
    }>;
    deleteBulk({ ids }: DeleteBulkDto): Promise<Prisma.BatchPayload>;
    updateProductMetrics(id: string, dto: UpdateProductMetricsDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        discount: number;
        slug: string;
        description: string;
        images: string[];
        stock: number;
        purchaseCount: number;
        ordersCount: number;
        price: number;
        oldPrice: number | null;
        percentageChange: number | null;
        updatedPriceAt: Date | null;
        categoryId: string;
    }>;
    private updateProductAttributes;
}
