import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: CreateUserDto, res: Response): Promise<{
        accessToken: string;
        user: {
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
        };
    }>;
    register(dto: CreateUserDto, res: Response): Promise<{
        accessToken: string;
        user: {
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
        };
    }>;
    getNewToken(req: Request, res: Response): Promise<{
        accessToken: string;
        user: {
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
        };
    }>;
    logout(res: Response): Promise<boolean>;
}
