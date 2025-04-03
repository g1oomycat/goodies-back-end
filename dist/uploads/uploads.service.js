"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
const uuid_1 = require("uuid");
const image_config_1 = require("./lib/constants/image-config");
let UploadsService = class UploadsService {
    constructor(prisma, s3Service) {
        this.prisma = prisma;
        this.s3Service = s3Service;
    }
    async uploadImages(entityType, files) {
        const config = image_config_1.imageConfig[entityType];
        if (!config) {
            throw new common_1.BadRequestException('Неверный тип сущности');
        }
        if (files.length > config.maxCount) {
            throw new common_1.BadRequestException(`Максимальное количество файлов: ${config.maxCount}`);
        }
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        const processedImages = [];
        try {
            for (const file of files) {
                const originalName = file.originalname.split('.');
                originalName.pop();
                const fileName = `${(0, uuid_1.v4)()}-${originalName.join('.')}.webp`;
                const outputPath = path.join('uploads', fileName);
                const sharpInstance = sharp(file.path);
                if (config.width > 0 && config.height > 0) {
                    sharpInstance.resize(config.width, config.height);
                }
                const effort = entityType === 'bannersLG' ||
                    entityType === 'bannersMD' ||
                    entityType === 'bannersSM'
                    ? 6
                    : 3;
                console.log(effort);
                await sharpInstance
                    .webp({ effort, quality: effort === 6 ? 90 : 80 })
                    .toFile(outputPath);
                const fileBuffer = fs.readFileSync(outputPath);
                const uploadedUrl = await this.s3Service.uploadFile(fileBuffer, 'image/webp', fileName, entityType);
                fs.unlinkSync(outputPath);
                processedImages.push({ url: uploadedUrl, fileName });
            }
            return processedImages;
        }
        catch (error) {
            console.error('Image Upload Error:', error);
            throw new common_1.InternalServerErrorException('Ошибка обработки изображений');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map