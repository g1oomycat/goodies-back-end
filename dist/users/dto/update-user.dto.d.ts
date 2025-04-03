import { Gender } from '@prisma/client';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    surName?: string;
    dateOfBirth?: Date;
    phone?: string;
    email: string;
    address?: string;
    gender?: Gender;
}
