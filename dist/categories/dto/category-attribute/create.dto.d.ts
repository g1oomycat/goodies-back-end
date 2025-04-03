declare enum AttributeType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    SELECT = "SELECT"
}
export declare class CreateCategoryAttributeDto {
    name: string;
    type: AttributeType;
    filterable?: boolean;
    options?: string[];
}
export {};
