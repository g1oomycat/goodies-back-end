import { BooleanLikeString } from 'src/common/types/boolean-like-string';
import { IParamsSort } from 'src/common/types/sort';
import { BannersService } from './banners.service';
import { ISortBanners } from './types/sort';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    getAll(title?: string, isActive?: BooleanLikeString, page?: string, limit?: string, sortBy?: ISortBanners, sort?: IParamsSort): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        totalResult: number;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            link: string | null;
            imageLG: string;
            imageMD: string;
            imageSM: string;
            textColor: string | null;
            buttonBG: string | null;
            buttonTextColor: string | null;
            startDate: Date | null;
            endDate: Date | null;
            isActive: boolean;
            position: number;
        }[];
    }>;
}
