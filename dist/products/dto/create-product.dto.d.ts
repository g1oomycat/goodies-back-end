export type ProductAttributesType = {
    categoryAttributeId: string;
    title: string;
    value: string | number | boolean;
};
export declare class CreateProductDto {
    name: string;
    description: string;
    stock: number;
    price: number;
    images: string[];
    categoryId: string;
    attributes: ProductAttributesType[];
}
