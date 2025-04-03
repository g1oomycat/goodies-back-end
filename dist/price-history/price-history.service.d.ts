import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { priceHistoryDto } from './dto/price-history.dto';
import { ISortPriceHistory } from './types/sort';
export declare class PriceHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        oldPrice: number;
        percentageChange: number;
        newPrice: number;
        priceChange: number;
    }>;
    getAll(productId?: string, name?: string, sortBy?: ISortPriceHistory, sort?: IParamsSort, limit?: number, page?: number, includeStatus?: boolean): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        resultCount: number;
        result: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            oldPrice: number;
            percentageChange: number;
            newPrice: number;
            priceChange: number;
        })[];
    }>;
    create(dto: priceHistoryDto, includeStatus?: boolean): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        oldPrice: number;
        percentageChange: number;
        newPrice: number;
        priceChange: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        oldPrice: number;
        percentageChange: number;
        newPrice: number;
        priceChange: number;
    }>;
}
