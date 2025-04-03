import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { ReviewsInstagramService } from './reviews-instagram.service';
import { ISortReviewsInstagram } from './types/sort';
export declare class ReviewsInstagramController {
    private readonly reviewsInstagramService;
    constructor(reviewsInstagramService: ReviewsInstagramService);
    getAll(name?: string, nick?: string, isActive?: BooleanLikeString, page?: string, limit?: string, sortBy?: ISortReviewsInstagram, sort?: IParamsSort): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string;
            isActive: boolean;
            position: number;
            nick: string;
        }[];
    }>;
}
