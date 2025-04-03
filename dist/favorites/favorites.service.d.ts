import { IParamsSort } from 'src/common/types/sort';
import { PrismaService } from 'src/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateFavoritesDto } from './dto/create-favorites.dto';
import { ISortFavorites } from './types/sort';
export declare class FavoritesService {
    private prisma;
    private productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    getAll(userId: string, limit?: number, page?: number, sortBy?: ISortFavorites, sort?: IParamsSort, includeStatus?: boolean): Promise<{
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
