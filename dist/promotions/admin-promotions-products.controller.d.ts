import { DeletePromotionProductsDto } from './dto/promotion-products/delete-promotion.dto';
import { CreatePromotionProductsDto } from './dto/promotion/create-promotion-products.dto';
import { PromotionsProductsService } from './promotions-products.service';
export declare class AdminPromotionsProductsController {
    private readonly promotionsProductsService;
    promotionsService: any;
    constructor(promotionsProductsService: PromotionsProductsService);
    create(dto: CreatePromotionProductsDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(dto: DeletePromotionProductsDto[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
