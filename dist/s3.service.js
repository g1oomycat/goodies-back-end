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
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('s3.region'),
            credentials: {
                accessKeyId: this.configService.get('s3.accessKeyId'),
                secretAccessKey: this.configService.get('s3.secretAccessKey'),
            },
        });
        this.bucketName = this.configService.get('s3.bucketName');
    }
    async uploadFile(fileBuffer, mimetype, fileName, entityType) {
        try {
            const folder = entityType ? `${entityType}/` : '';
            const fileKey = `${folder}${fileName.replace(/\s+/g, '_')}`;
            const upload = new lib_storage_1.Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucketName,
                    Key: fileKey,
                    Body: fileBuffer,
                    ContentType: mimetype,
                },
            });
            await upload.done();
            return this.getFileUrl(fileKey);
        }
        catch (error) {
            console.error('S3 Upload Error:', error);
            throw new common_1.InternalServerErrorException('Ошибка загрузки файла в S3');
        }
    }
    async uploadFilesBulk(files) {
        try {
            const uploadPromises = files.map((file) => this.uploadFile(file.buffer, file.mimetype, file.fileName));
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            console.error('S3 Multi-Upload Error:', error);
            throw new common_1.InternalServerErrorException('Ошибка загрузки файлов в S3');
        }
    }
    async deleteFile(fileName) {
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            }));
        }
        catch (error) {
            console.error('S3 Delete Error:', error);
            throw new common_1.InternalServerErrorException('Ошибка удаления файла в S3');
        }
    }
    async deleteFileByUrl(fileUrl) {
        try {
            const url = new URL(fileUrl);
            const key = decodeURIComponent(url.pathname.substring(1));
            console.log('Полный URL:', fileUrl);
            console.log('Parsed path:', url.pathname);
            console.log('Extracted Key:', key);
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }));
            console.log(`Файл ${key}:${this.bucketName} успешно удален из S3`);
        }
        catch (error) {
            console.error('S3 Delete Error:', error);
            throw new common_1.InternalServerErrorException('Ошибка удаления файла в S3');
        }
    }
    async deleteFileByUrlBulk(filesUrl) {
        try {
            console.log(filesUrl);
            const deletePromises = filesUrl.map((file) => this.deleteFileByUrl(file));
            return await Promise.all(deletePromises);
        }
        catch (error) {
            console.error('S3 Multi-Delete Error:', error);
            throw new common_1.InternalServerErrorException('Ошибка удаления файлов в S3');
        }
    }
    getFileUrl(fileName) {
        return `https://${this.bucketName}.s3.${this.configService.get('s3.region')}.amazonaws.com/${fileName}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map