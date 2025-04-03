import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private readonly s3Client;
    private readonly bucketName;
    constructor(configService: ConfigService);
    uploadFile(fileBuffer: Buffer, mimetype: string, fileName: string, entityType?: string): Promise<string>;
    uploadFilesBulk(files: {
        buffer: Buffer;
        mimetype: string;
        fileName: string;
    }[]): Promise<string[]>;
    deleteFile(fileName: string): Promise<void>;
    deleteFileByUrl(fileUrl: string): Promise<void>;
    deleteFileByUrlBulk(filesUrl: string[]): Promise<void[]>;
    getFileUrl(fileName: string): string;
}
