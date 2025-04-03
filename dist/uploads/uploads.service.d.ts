import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3.service';
import { IEntityType } from './types/entity-type';
export declare class UploadsService {
    private readonly prisma;
    private readonly s3Service;
    constructor(prisma: PrismaService, s3Service: S3Service);
    uploadImages(entityType: IEntityType, files: Express.Multer.File[]): Promise<{
        url: string;
        fileName: string;
    }[]>;
}
