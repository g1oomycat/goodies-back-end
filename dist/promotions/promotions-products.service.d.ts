import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { DeletePromotionProductsDto } from './dto/promotion-products/delete-promotion.dto';
import { CreatePromotionProductsDto } from './dto/promotion/create-promotion-products.dto';
import { ISortPromotionsProducts } from './types/sort';
export declare class PromotionsProductsService {
    private prisma;
    private productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    getAll(promoId: string, sortBy?: ISortPromotionsProducts, sort?: IParamsSort, limit?: number, page?: number, isLowStock?: boolean): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        resultCount: number;
        result: any[];
        totalResult?: undefined;
    } | {
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: {
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
        };
        resultCount?: undefined;
    }>;
    addProducts(dto: CreatePromotionProductsDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteProducts(dto: DeletePromotionProductsDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
