import { IParamsSort } from 'src/common/types/sort';
import { CreateFavoritesDto } from './dto/create-favorites.dto';
import { FavoritesService } from './favorites.service';
import { ISortFavorites } from './types/sort';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    getAll(userId: string, limit?: string, page?: string, sortBy?: ISortFavorites, sort?: IParamsSort): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
        })[];
    }>;
    create(userId: string, dto: CreateFavoritesDto): Promise<{
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
    }>;
    delete(userId: string, dto: CreateFavoritesDto): Promise<{
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
    }>;
}
