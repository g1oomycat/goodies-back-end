import { CreatePromotionDto } from './dto/promotion-products/create-promotion.dto';
import { UpdatePromotionDto } from './dto/promotion/update-promotion-products.dto';
import { PromotionsService } from './promotions.service';
export declare class AdminPromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    getOne(id: string): Promise<{
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
    create(dto: CreatePromotionDto): Promise<{
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
    update(dto: UpdatePromotionDto, id: string): Promise<{
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
    delete(id: string): Promise<{
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
