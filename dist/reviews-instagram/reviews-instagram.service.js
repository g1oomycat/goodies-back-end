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
exports.ReviewsInstagramService = void 0;
const common_1 = require("@nestjs/common");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
let ReviewsInstagramService = class ReviewsInstagramService {
    constructor(prisma, S3Service) {
        this.prisma = prisma;
        this.S3Service = S3Service;
    }
    async getAll(name, nick, isActive, sortBy, sort, limit, page) {
        console.log(isActive);
        const where = {
            ...(typeof isActive === 'boolean'
                ? { isActive: { equals: isActive } }
                : {}),
            ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
            ...(nick ? { nick: { contains: nick, mode: 'insensitive' } } : {}),
        };
        const orderBy = sortBy ? { [sortBy]: sort } : {};
        const totalCount = await this.prisma.reviewsInstagram.count({
            where,
        });
        const result = await this.prisma.reviewsInstagram.findMany({
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
        const reviewsInstagram = await this.prisma.reviewsInstagram.findUnique({
            where: {
                id,
            },
        });
        if (!reviewsInstagram)
            throw new common_1.NotFoundException('Отзыв не найден');
        return reviewsInstagram;
    }
    async create(dto) {
        let { position } = dto;
        try {
            if (!position) {
                const lastReviewInst = await this.prisma.reviewsInstagram.findFirst({
                    orderBy: { position: 'desc' },
                    select: {
                        position: true,
                    },
                });
                position = lastReviewInst ? lastReviewInst.position + 1 : 0;
            }
            return this.prisma.reviewsInstagram.create({
                data: {
                    ...dto,
                    position,
                },
            });
        }
        catch (error) {
            try {
                await this.S3Service.deleteFileByUrl(dto.image);
            }
            catch (error) {
                console.error('Ошибка при удалении загруженных изображений:', error);
            }
            throw error;
        }
    }
    async update(dto, id) {
        let currentReviewInstagram = null;
        try {
            currentReviewInstagram = await this.getOne(id);
            const updatedReviewsInstagram = await this.prisma.reviewsInstagram.update({
                where: {
                    id,
                },
                data: {
                    ...dto,
                },
            });
            if (dto.image && dto.image !== currentReviewInstagram.image)
                await this.S3Service.deleteFileByUrl(currentReviewInstagram.image);
            return updatedReviewsInstagram;
        }
        catch (error) {
            if (dto.image) {
                try {
                    if (currentReviewInstagram) {
                        if (dto.image !== currentReviewInstagram.image) {
                            await this.S3Service.deleteFileByUrl(dto.image);
                        }
                    }
                    else {
                        await this.S3Service.deleteFileByUrl(dto.image);
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
        const { image } = await this.getOne(id);
        const deletedReviewsInstagram = await this.prisma.reviewsInstagram.delete({
            where: {
                id,
            },
        });
        await this.S3Service.deleteFileByUrl(image);
        return deletedReviewsInstagram;
    }
    async deleteBulk({ ids }) {
        const reviewsInstagramImages = await this.prisma.reviewsInstagram.findMany({
            where: { id: { in: ids } },
            select: { image: true },
        });
        if (reviewsInstagramImages.length !== ids.length) {
            throw new common_1.NotFoundException('Некоторые отзывы не найдены');
        }
        const images = reviewsInstagramImages.flatMap((el) => el.image);
        await this.S3Service.deleteFileByUrlBulk(images);
        return this.prisma.products.deleteMany({
            where: { id: { in: ids } },
        });
    }
};
exports.ReviewsInstagramService = ReviewsInstagramService;
exports.ReviewsInstagramService = ReviewsInstagramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], ReviewsInstagramService);
//# sourceMappingURL=reviews-instagram.service.js.map