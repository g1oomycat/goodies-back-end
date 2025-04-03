import { CreateCategoryAttributeDto } from '../category-attribute/create.dto';
export declare class CreateCategoryDto {
    name: string;
    description: string;
    image: string;
    attributes?: CreateCategoryAttributeDto[];
    numberSort?: number;
}
