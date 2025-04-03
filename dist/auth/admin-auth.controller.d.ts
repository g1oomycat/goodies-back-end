import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
export declare class AdminAuthController {
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
}
