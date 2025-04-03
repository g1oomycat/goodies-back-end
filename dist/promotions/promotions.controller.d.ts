import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { PromotionsService } from './promotions.service';
import { ISortPromotions } from './types/sort';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    getAll(page?: string, limit?: string, sortBy?: ISortPromotions, sort?: IParamsSort, isActive?: BooleanLikeString): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            image: string;
            title: string;
            link: string | null;
            startDate: Date | null;
            endDate: Date | null;
            isActive: boolean;
            content: string | null;
        }[];
    }>;
    getOneBySlug(slug: string): Promise<{
        products: {
            productId: string;
            promoId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        image: string;
        title: string;
        link: string | null;
        startDate: Date | null;
        endDate: Date | null;
        isActive: boolean;
        content: string | null;
    }>;
}
