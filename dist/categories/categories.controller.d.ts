import { IParamsSort } from 'src/common/types/sort';
import { CategoriesService } from './categories.service';
import { ISortCategories } from './types';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll(name?: string, sortBy?: ISortCategories, sort?: IParamsSort, limit?: string, page?: string): Promise<{
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
    getOneBySlug(slug: string): Promise<{
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
}
