import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { CartService } from 'src/cart/cart.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private jwt;
    private usersService;
    private cartService;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    EXPIRE_DAY_REFRESH_TOKEN: number;
    ACCESS_TOKEN_EXPIRES_IN_ADMIN: string;
    REFRESH_TOKEN_EXPIRES_IN_ADMIN: string;
    EXPIRE_DAY_REFRESH_TOKEN_ADMIN: number;
    REFRESH_TOKEN_NAME: string;
    constructor(jwt: JwtService, usersService: UsersService, cartService: CartService);
    adminLogin(dto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
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
    login(dto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
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
    register(dto: CreateUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
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
    getNewTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
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
    private issueTokens;
    private validateUser;
    addRefreshTokenToResponse(res: Response, refreshToken: string, role: UserRole): void;
    removeRefreshTokenToResponse(res: Response): void;
}
