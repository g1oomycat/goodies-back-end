import { UserRole } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
declare const CreateUserByAdminDto_base: import("@nestjs/mapped-types").MappedType<CreateUserDto & Partial<Omit<UpdateUserDto, "email">>>;
export declare class CreateUserByAdminDto extends CreateUserByAdminDto_base {
    role: UserRole;
}
export {};
