import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category/create.dto';
import { UpdateCategoryDto } from './dto/category/update.dto';
export declare class AdminCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getOne(id: string): Promise<{
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
    create(dto: CreateCategoryDto): Promise<{
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
    update(dto: UpdateCategoryDto, id: string): Promise<{
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
    deleteBulk(dto: DeleteBulkDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string): Promise<{
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
