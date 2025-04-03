import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isCuid } from 'cuid'; // правильный импорт функции isCuid

@ValidatorConstraint({ async: false })
export class IsCuidConstraint implements ValidatorConstraintInterface {
  validate(cuidValue: any) {
    return typeof cuidValue === 'string' && isCuid(cuidValue);
  }

  defaultMessage() {
    return 'ID должен быть корректным CUID';
  }
}

export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCuidConstraint,
    });
  };
}
