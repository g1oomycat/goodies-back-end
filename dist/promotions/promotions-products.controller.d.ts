import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { PromotionsProductsService } from './promotions-products.service';
import { ISortPromotionsProducts } from './types/sort';
export declare class PromotionsProductsController {
    private readonly promotionsProductsService;
    promotionsService: any;
    constructor(promotionsProductsService: PromotionsProductsService);
    getAll(promoId: string, page?: string, limit?: string, sortBy?: ISortPromotionsProducts, sort?: IParamsSort, isLowStock?: BooleanLikeString): Promise<{
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
}
