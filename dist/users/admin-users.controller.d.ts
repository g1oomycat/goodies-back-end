import { UserRole } from '@prisma/client';
import { DeleteBulkDto } from 'src/common/dto/delete-bulk';
import { IParamsSort } from 'src/common/types/sort';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { ISortUsers } from './types/sort';
import { UsersService } from './users.service';
export declare class AdminUsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAll(adminRole: UserRole, userId?: string, firstName?: string, lastName?: string, phone?: string, email?: string, role?: UserRole, sortBy?: ISortUsers, sort?: IParamsSort, limit?: string, page?: string): Promise<{
        page: number;
        limit: number;
        totalCount: number;
        resultCount: number;
        result: any[];
    }>;
    getOne(id: string, adminRole: UserRole): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        surName: string | null;
        email: string;
        phone: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        dateOfBirth: Date | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    create(dto: CreateUserByAdminDto, adminRole: UserRole): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        surName: string | null;
        email: string;
        phone: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        dateOfBirth: Date | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    update(id: string, adminRole: UserRole, dto: UpdateUserByAdminDto): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        surName: string | null;
        email: string;
        phone: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        dateOfBirth: Date | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        firstName: string | null;
        lastName: string | null;
        surName: string | null;
        email: string;
        phone: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        dateOfBirth: Date | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteBulk(dto: DeleteBulkDto, adminRole: UserRole): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: string, adminRole: UserRole): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        surName: string | null;
        email: string;
        phone: string | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        dateOfBirth: Date | null;
        password: string;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
