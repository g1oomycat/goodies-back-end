"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserByAdminDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const create_user_dto_1 = require("./create-user.dto");
const update_user_dto_1 = require("./update-user.dto");
class CreateUserByAdminDto extends (0, mapped_types_1.IntersectionType)(create_user_dto_1.CreateUserDto, (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(update_user_dto_1.UpdateUserDto, ['email']))) {
}
exports.CreateUserByAdminDto = CreateUserByAdminDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], CreateUserByAdminDto.prototype, "role", void 0);
//# sourceMappingURL=create-user-by-admin.dto.js.map