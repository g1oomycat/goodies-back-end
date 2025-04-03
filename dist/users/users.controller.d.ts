import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getSelf(id: string): Promise<{
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
    updateUser(id: string, dto: UpdateUserDto): Promise<{
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
    deleteUser(id: string, res: Response): Promise<{
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
