import { ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsCuidConstraint implements ValidatorConstraintInterface {
    validate(cuidValue: any): boolean;
    defaultMessage(): string;
}
export declare function IsCuid(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
