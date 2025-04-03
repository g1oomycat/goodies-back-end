import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { ProductsService } from './products.service';
import { ISortProducts } from './types/sort';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAll(categoryId?: string, page?: string, limit?: string, sortBy?: ISortProducts, sort?: IParamsSort, isLowStock?: BooleanLikeString, name?: string): Promise<{
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
    getOneBySlug(slug: string): Promise<{
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
}
