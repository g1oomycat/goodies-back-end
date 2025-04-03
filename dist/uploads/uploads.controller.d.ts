import { IEntityType } from './types/entity-type';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImages(entityType: IEntityType, images: Express.Multer.File[]): Promise<{
        url: string;
        fileName: string;
    }[]>;
}
