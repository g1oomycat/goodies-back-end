"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserByAdminDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_by_admin_dto_1 = require("./create-user-by-admin.dto");
class UpdateUserByAdminDto extends (0, mapped_types_1.PartialType)(create_user_by_admin_dto_1.CreateUserByAdminDto) {
}
exports.UpdateUserByAdminDto = UpdateUserByAdminDto;
//# sourceMappingURL=update-user-by-admin.dto.js.map