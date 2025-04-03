"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCuidConstraint = void 0;
exports.IsCuid = IsCuid;
const class_validator_1 = require("class-validator");
const cuid_1 = require("cuid");
let IsCuidConstraint = class IsCuidConstraint {
    validate(cuidValue) {
        return typeof cuidValue === 'string' && (0, cuid_1.isCuid)(cuidValue);
    }
    defaultMessage() {
        return 'ID должен быть корректным CUID';
    }
};
exports.IsCuidConstraint = IsCuidConstraint;
exports.IsCuidConstraint = IsCuidConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsCuidConstraint);
function IsCuid(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCuidConstraint,
        });
    };
}
//# sourceMappingURL=is-cuid.validator.js.map