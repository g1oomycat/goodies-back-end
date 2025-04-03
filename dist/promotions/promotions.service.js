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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const slugify_1 = require("../common/utils/slugify");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
let PromotionsService = class PromotionsService {
    constructor(prisma, S3Service) {
        this.prisma = prisma;
        this.S3Service = S3Service;
    }
    async getAll(sortBy, sort, limit, page, isActive = true) {
        const whereClause = {
            ...(isActive ? { isActive: { equals: true } } : {}),
        };
        const orderByClause = sortBy ? { [sortBy]: sort } : {};
        const totalCount = await this.prisma.promo.count({
            where: whereClause,
        });
        const result = await this.prisma.promo.findMany({
            where: whereClause,
            orderBy: orderByClause,
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
    async getOne(uniqValue, identifier) {
        const promo = await this.prisma.promo.findFirst({
            where: {
                [identifier]: uniqValue,
            },
            include: {
                products: true,
            },
        });
        if (!promo)
            throw new common_1.NotFoundException('Акция не найдена');
        return promo;
    }
    async create(dto) {
        const slug = (0, slugify_1.slugify)(dto.title);
        const isProduct = await this.prisma.promo.findUnique({
            where: { slug },
        });
        if (isProduct)
            throw new common_1.ConflictException(`Акция с таким slug: ${slug} уже существует`);
        return this.prisma.promo.create({
            data: {
                ...dto,
                slug,
            },
        });
    }
    async update(dto, id) {
        const { image } = await this.getOne(id, 'id');
        const updatedPromo = await this.prisma.promo.update({
            where: {
                id,
            },
            data: {
                ...dto,
            },
        });
        if (dto.image)
            await this.S3Service.deleteFileByUrl(image);
        return updatedPromo;
    }
    async delete(id) {
        const { image } = await this.getOne(id, 'id');
        const deletedPromo = await this.prisma.promo.delete({
            where: {
                id,
            },
        });
        await this.S3Service.deleteFileByUrl(image);
        return deletedPromo;
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map