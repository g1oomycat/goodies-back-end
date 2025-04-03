import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class AdminProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getOne(id: string): Promise<{
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
    create(dto: CreateProductDto): Promise<{
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
        attributes: ({
            categoryAttribute: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.AttributeType;
                categoryId: string;
                filterable: boolean;
                options: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            title: string;
            value: string;
            categoryAttributeId: string;
        })[];
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
    update(dto: UpdateProductDto, id: string): Promise<{
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
    deleteBulk(dto: DeleteBulkDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string): Promise<{
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
