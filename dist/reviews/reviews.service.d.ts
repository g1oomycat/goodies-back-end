import { OrdersService } from 'src/orders/orders.service';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private prisma;
    private ordersService;
    constructor(prisma: PrismaService, ordersService: OrdersService);
    private isBuyProduct;
    getOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        comment: string | null;
        rating: number;
    }>;
    getAll(userId?: string, productId?: string, sortBy?: 'rating' | 'updatedAt', sortReviews?: 'asc' | 'desc'): Promise<({
        user: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            surName: string | null;
            email: string;
            phone: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            dateOfBirth: Date | null;
            password: string;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.UserRole;
        };
        product: {
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
        comment: string | null;
        rating: number;
    })[]>;
    getAllByProductId(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        comment: string | null;
        rating: number;
    }[]>;
    create(dto: CreateReviewDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        comment: string | null;
        rating: number;
    }>;
    update(dto: UpdateReviewDto, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        comment: string | null;
        rating: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        userId: string;
        comment: string | null;
        rating: number;
    }>;
}
