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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
let BannersService = class BannersService {
    constructor(prisma, S3Service) {
        this.prisma = prisma;
        this.S3Service = S3Service;
    }
    async getAll(title, isActive, sortBy, sort, limit, page) {
        const where = {
            ...(typeof isActive === 'boolean'
                ? { isActive: { equals: isActive } }
                : {}),
            ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
        };
        const orderBy = sortBy ? { [sortBy]: sort } : {};
        const totalCount = await this.prisma.banner.count({
            where,
        });
        const result = await this.prisma.banner.findMany({
            where,
            orderBy,
            ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
        });
        return {
            page,
            limit,
            totalCount,
            totalResult: result.length,
            result,
        };
    }
    async getOne(id) {
        const banner = await this.prisma.banner.findUnique({
            where: {
                id,
            },
        });
        if (!banner)
            throw new common_1.NotFoundException('Товар не найден');
        return banner;
    }
    async create(dto) {
        const now = new Date();
        let isActive = true;
        let { position, ...data } = dto;
        if (data.startDate && new Date(data.startDate) >= now)
            isActive = false;
        if (data.endDate && new Date(data.endDate) <= now)
            isActive = false;
        try {
            if (!position) {
                const lastCategory = await this.prisma.banner.findFirst({
                    orderBy: { position: 'desc' },
                    select: {
                        position: true,
                    },
                });
                position = lastCategory ? lastCategory.position + 1 : 0;
            }
            return this.prisma.banner.create({
                data: {
                    ...data,
                    position,
                    isActive,
                },
            });
        }
        catch (error) {
            try {
                await this.S3Service.deleteFileByUrlBulk([
                    data.imageLG,
                    data.imageMD,
                    data.imageSM,
                ]);
            }
            catch (error) { }
            throw error;
        }
    }
    async update(dto, id) {
        const now = new Date();
        let currentBanner = null;
        try {
            currentBanner = await this.getOne(id);
            let isActive = dto.isActive ?? currentBanner.isActive;
            if (dto.startDate && new Date(dto.startDate) >= now)
                isActive = false;
            if (dto.endDate && new Date(dto.endDate) <= now)
                isActive = false;
            const updatedBanner = await this.prisma.banner.update({
                where: {
                    id,
                },
                data: {
                    ...dto,
                    isActive,
                },
            });
            const imagesToDelete = [
                dto.imageLG !== undefined && dto.imageLG !== currentBanner.imageLG
                    ? currentBanner.imageLG
                    : null,
                dto.imageMD !== undefined && dto.imageMD !== currentBanner.imageMD
                    ? currentBanner.imageMD
                    : null,
                dto.imageSM !== undefined && dto.imageSM !== currentBanner.imageSM
                    ? currentBanner.imageSM
                    : null,
            ].filter(Boolean);
            if (imagesToDelete.length) {
                await this.S3Service.deleteFileByUrlBulk(imagesToDelete);
            }
            console.log('банер есть');
            return updatedBanner;
        }
        catch (error) {
            console.log('словили ошибку');
            if (dto.imageLG || dto.imageMD || dto.imageSM) {
                try {
                    if (currentBanner) {
                        console.log('ошибка и банер есть');
                        const imagesToDelete = [
                            dto.imageLG !== currentBanner.imageLG
                                ? (dto.imageLG ?? null)
                                : null,
                            dto.imageMD !== currentBanner.imageMD
                                ? (dto.imageMD ?? null)
                                : null,
                            dto.imageSM !== currentBanner.imageSM
                                ? (dto.imageSM ?? null)
                                : null,
                        ].filter(Boolean);
                        if (imagesToDelete.length) {
                            await this.S3Service.deleteFileByUrlBulk(imagesToDelete);
                        }
                    }
                    else {
                        console.log('ошибка и банера нет');
                        const imagesToDelete = [
                            dto?.imageLG ?? null,
                            dto?.imageMD ?? null,
                            dto?.imageSM ?? null,
                        ].filter(Boolean);
                        if (imagesToDelete.length) {
                            await this.S3Service.deleteFileByUrlBulk(imagesToDelete);
                        }
                    }
                }
                catch (error) {
                    console.error('Ошибка при удалении загруженных изображений:', error);
                }
            }
            throw error;
        }
    }
    async delete(id) {
        const { imageLG, imageMD, imageSM } = await this.getOne(id);
        const deletedBanner = await this.prisma.banner.delete({
            where: {
                id,
            },
        });
        await this.S3Service.deleteFileByUrlBulk([imageLG, imageMD, imageSM]);
        return deletedBanner;
    }
    async deleteBulk({ ids }) {
        const bannersImages = await this.prisma.banner.findMany({
            where: { id: { in: ids } },
            select: { imageLG: true, imageMD: true, imageSM: true },
        });
        if (bannersImages.length !== ids.length) {
            throw new common_1.NotFoundException('Некоторые баннеры не найдены');
        }
        const images = bannersImages.flatMap((el) => [
            el.imageLG,
            el.imageMD,
            el.imageSM,
        ]);
        await this.S3Service.deleteFileByUrlBulk(images);
        return this.prisma.banner.deleteMany({
            where: { id: { in: ids } },
        });
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], BannersService);
//# sourceMappingURL=banners.service.js.map