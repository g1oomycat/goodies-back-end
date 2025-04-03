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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const capitalize_first_letter_1 = require("../common/utils/capitalize-first-letter");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const slugify_1 = require("../common/utils/slugify");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
let CategoriesService = class CategoriesService {
    constructor(prisma, S3Service) {
        this.prisma = prisma;
        this.S3Service = S3Service;
    }
    async getAll(name, sortBy, sort, limit, page) {
        const where = {
            ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
        };
        const orderBy = sortBy
            ? sortBy === 'countProduct'
                ? { products: { _count: sort } }
                : { [sortBy]: sort }
            : {};
        const categoriesList = await this.prisma.categories.findMany({
            orderBy: orderBy,
            where,
            include: {
                _count: {
                    select: { products: true },
                },
                attributes: true,
            },
            ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
        });
        const totalCount = await this.prisma.categories.count({
            where,
        });
        return {
            page,
            limit,
            totalCount,
            resultCount: categoriesList.length,
            result: categoriesList,
        };
    }
    async getOne(uniqValue, identifier, includeAttributes = true) {
        const categories = await this.prisma.categories.findFirst({
            where: {
                [identifier]: uniqValue,
            },
            include: {
                _count: {
                    select: { products: true },
                },
                attributes: includeAttributes,
            },
        });
        if (!categories)
            throw new common_1.NotFoundException('Категория не найдена');
        return categories;
    }
    async create(dto) {
        const { attributes, ...data } = dto;
        const slug = (0, slugify_1.slugify)(dto.name);
        try {
            const isCategories = await this.prisma.categories.findUnique({
                where: {
                    slug,
                },
            });
            if (isCategories)
                throw new common_1.ConflictException(`Категория с таким slug: ${slug} уже существует`);
            const lastCategory = await this.prisma.categories.findFirst({
                orderBy: { numberSort: 'desc' },
                select: {
                    numberSort: true,
                },
            });
            const numberSort = lastCategory ? lastCategory.numberSort + 1 : 0;
            return this.prisma.categories.create({
                data: {
                    ...data,
                    slug,
                    numberSort,
                    attributes: attributes
                        ? {
                            create: attributes.map((attr) => ({
                                name: attr.name,
                                type: attr.type,
                                filterable: attr.filterable ?? true,
                                options: attr.options,
                            })),
                        }
                        : undefined,
                },
                include: {
                    _count: {
                        select: { products: true },
                    },
                    attributes: true,
                },
            });
        }
        catch (error) {
            try {
                await this.S3Service.deleteFileByUrl(data.image);
            }
            catch (deleteError) {
                console.error('Ошибка при удалении загруженных изображений:', deleteError);
            }
            throw error;
        }
    }
    async update(dto, id) {
        const { attributes, ...data } = dto;
        let currentCategory = null;
        try {
            currentCategory = await this.getOne(id, 'id', false);
            if (data.name && data.name !== currentCategory.name) {
                const slug = (0, slugify_1.slugify)(data.name);
                const category = await this.prisma.categories.findUnique({
                    where: { id },
                });
                if (!category)
                    throw new common_1.ConflictException(`Категория с таким slug:${slug} уже существует`);
                data['slug'] = slug;
                data.name = (0, capitalize_first_letter_1.capitalizeFirstLetter)(data.name);
            }
            const category = await this.prisma.$transaction(async (prisma) => {
                if (attributes) {
                    await this.updateCategoryAttributes(prisma, id, attributes);
                }
                return prisma.categories.update({
                    where: { id },
                    data,
                    include: {
                        _count: {
                            select: { products: true },
                        },
                        attributes: true,
                    },
                });
            });
            if (data.image && data.image !== currentCategory.image) {
                await this.S3Service.deleteFileByUrl(currentCategory.image);
            }
            return category;
        }
        catch (error) {
            if (data.image) {
                try {
                    if (currentCategory.image) {
                        if (currentCategory.image !== data.image)
                            await this.S3Service.deleteFileByUrl(data.image);
                    }
                    else {
                        await this.S3Service.deleteFileByUrl(data.image);
                    }
                }
                catch (deleteError) {
                    console.error('Ошибка при удалении загруженных изображений:', deleteError);
                }
            }
            throw error;
        }
    }
    async delete(id) {
        const currentCategory = await this.getOne(id, 'id', false);
        const deletedCategory = await this.prisma.categories.delete({
            where: {
                id,
            },
        });
        await this.S3Service.deleteFileByUrl(currentCategory.image);
        return deletedCategory;
    }
    async deleteBulk({ ids }) {
        const categoriesImages = await this.prisma.categories.findMany({
            where: { id: { in: ids } },
            select: { image: true },
        });
        if (categoriesImages.length !== ids.length) {
            throw new common_1.NotFoundException('Некоторые категории не найдены');
        }
        const images = categoriesImages.map((el) => el.image);
        await this.S3Service.deleteFileByUrlBulk(images);
        return this.prisma.products.deleteMany({
            where: { id: { in: ids } },
        });
    }
    async updateCategoryAttributes(prisma, categoryId, attributes) {
        const existingAttributes = await prisma.categoryAttributes.findMany({
            where: { categoryId },
        });
        const toCreate = attributes.filter((attr) => !existingAttributes.some((ex) => ex.name === attr.name));
        const toUpdate = attributes.filter((attr) => existingAttributes.some((ex) => ex.name === attr.name));
        const toDelete = existingAttributes.filter((ex) => !attributes.some((attr) => attr.name === ex.name));
        if (toDelete.length > 0) {
            await prisma.categoryAttributes.deleteMany({
                where: {
                    id: { in: toDelete.map((attr) => attr.id) },
                },
            });
        }
        if (toCreate.length > 0) {
            await prisma.categoryAttributes.createMany({
                data: toCreate.map((attr) => ({
                    name: attr.name,
                    type: attr.type,
                    filterable: attr.filterable ?? true,
                    options: attr.options,
                    categoryId,
                })),
            });
        }
        for (const attr of toUpdate) {
            const existingAttr = existingAttributes.find((ex) => ex.name === attr.name);
            if (existingAttr) {
                await prisma.categoryAttributes.update({
                    where: { id: existingAttr.id },
                    data: {
                        name: attr.name,
                        type: attr.type,
                        filterable: attr.filterable ?? existingAttr.filterable,
                        options: attr.options,
                    },
                });
            }
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        s3_service_1.S3Service])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map