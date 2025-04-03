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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const get_percentage_change_1 = require("../common/utils/get-percentage-change");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const price_history_service_1 = require("../price-history/price-history.service");
const prisma_service_1 = require("../prisma.service");
const s3_service_1 = require("../s3.service");
const slugify_1 = require("../common/utils/slugify");
let ProductsService = class ProductsService {
    constructor(prisma, priceHistoryService, S3Service) {
        this.prisma = prisma;
        this.priceHistoryService = priceHistoryService;
        this.S3Service = S3Service;
    }
    async getAll(categoryId, sortBy, sort, limit, page, isLowStock = true, includeStatus = true, whereExtra = {}, name) {
        const where = {
            ...(categoryId ? { categoryId } : {}),
            ...whereExtra,
            ...(isLowStock ? { stock: { gt: 0 } } : {}),
            ...(name ? { name: { contains: name, mode: 'insensitive' } } : {}),
        };
        const orderBy = sortBy ? { [sortBy]: sort } : {};
        const totalCount = await this.prisma.products.count({
            where,
        });
        const result = await this.prisma.products.findMany({
            where,
            orderBy,
            ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
            include: {
                reviews: includeStatus,
                category: includeStatus,
                attributes: includeStatus,
            },
        });
        return {
            page,
            limit,
            totalCount,
            totalResult: result.length,
            result,
        };
    }
    async getOne(uniqValue, identifier, includeStatus = true) {
        const product = await this.prisma.products.findFirst({
            where: {
                [identifier]: uniqValue,
            },
            include: {
                reviews: includeStatus,
                category: includeStatus,
                attributes: includeStatus,
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Товар не найден');
        return product;
    }
    async create(dto) {
        const { categoryId, attributes, ...data } = dto;
        const slug = (0, slugify_1.slugify)(dto.name);
        try {
            const resBySlugProduct = await this.prisma.products.findUnique({
                where: { slug },
            });
            if (resBySlugProduct) {
                throw new common_1.ConflictException(`Товар с таким slug: ${slug} уже существует`);
            }
            return this.prisma.products.create({
                data: {
                    ...data,
                    slug,
                    category: {
                        connect: {
                            id: categoryId,
                        },
                    },
                    attributes: {
                        create: dto.attributes.map((attr) => ({
                            value: String(attr.value),
                            title: attr.title,
                            categoryAttribute: {
                                connect: {
                                    id: attr.categoryAttributeId,
                                },
                            },
                        })),
                    },
                },
                include: {
                    reviews: true,
                    category: true,
                    attributes: { include: { categoryAttribute: true } },
                },
            });
        }
        catch (error) {
            if (data.images.length) {
                try {
                    await this.S3Service.deleteFileByUrlBulk(data.images);
                }
                catch (deleteError) {
                    console.error('Ошибка при удалении загруженных изображений:', deleteError);
                }
            }
            throw error;
        }
    }
    async update(dto, id) {
        const { attributes, categoryId, ...data } = dto;
        let currentProduct = null;
        try {
            currentProduct = await this.getOne(id, 'id', false);
            if (categoryId && categoryId !== currentProduct.categoryId) {
                data['category'] = { connect: { id: categoryId } };
            }
            if (data.name && data.name !== currentProduct.name) {
                const slug = (0, slugify_1.slugify)(data.name);
                const resBySlugProduct = await this.prisma.products.findUnique({
                    where: { slug },
                });
                if (resBySlugProduct) {
                    throw new common_1.ConflictException(`Товар с таким slug: ${slug} уже существует`);
                }
                data['slug'] = slug;
            }
            const product = await this.prisma.$transaction(async (prisma) => {
                let { percentageChange, discount, updatedPriceAt, oldPrice } = currentProduct;
                if (data.price && data.price !== currentProduct.price) {
                    oldPrice = currentProduct.price;
                    percentageChange = (0, get_percentage_change_1.GetPercentageChange)(data.price, oldPrice);
                    const priceChange = oldPrice - data.price;
                    discount = priceChange > 0 ? priceChange : 0;
                    updatedPriceAt = new Date();
                    await prisma.priceHistory.create({
                        data: {
                            newPrice: data.price,
                            oldPrice: oldPrice,
                            percentageChange,
                            priceChange,
                            product: {
                                connect: {
                                    id,
                                },
                            },
                        },
                    });
                }
                await prisma.products.update({
                    where: { id },
                    data: {
                        ...data,
                        oldPrice,
                        discount,
                        percentageChange,
                        updatedPriceAt,
                    },
                });
                if (attributes) {
                    await this.updateProductAttributes(prisma, id, attributes);
                }
                return prisma.products.findUnique({
                    where: { id },
                    include: {
                        reviews: true,
                        category: true,
                        attributes: true,
                    },
                });
            });
            if (Array.isArray(data.images) && Array.isArray(currentProduct.images)) {
                const imagesForDelete = currentProduct.images.filter((img) => !data.images.includes(img));
                if (imagesForDelete.length) {
                    await this.S3Service.deleteFileByUrlBulk(imagesForDelete);
                }
            }
            return product;
        }
        catch (error) {
            if (Array.isArray(data.images) && data.images.length) {
                try {
                    if (currentProduct) {
                        const imagesForDelete = data.images.filter((img) => !currentProduct.images.includes(img));
                        if (imagesForDelete.length) {
                            await this.S3Service.deleteFileByUrlBulk(imagesForDelete);
                        }
                    }
                    else {
                        await this.S3Service.deleteFileByUrlBulk(data.images);
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
        const product = await this.getOne(id, 'id', false);
        const deletedProduct = await this.prisma.products.delete({
            where: {
                id,
            },
        });
        await this.S3Service.deleteFileByUrlBulk(product.images);
        return deletedProduct;
    }
    async deleteBulk({ ids }) {
        const productsImages = await this.prisma.products.findMany({
            where: { id: { in: ids } },
            select: { images: true },
        });
        if (productsImages.length !== ids.length) {
            throw new common_1.NotFoundException('Некоторые товары не найдены');
        }
        const images = productsImages.flatMap((el) => el.images);
        await this.S3Service.deleteFileByUrlBulk(images);
        return this.prisma.products.deleteMany({
            where: { id: { in: ids } },
        });
    }
    async updateProductMetrics(id, dto) {
        return this.prisma.products.update({
            where: {
                id,
            },
            data: {
                ...dto,
            },
        });
    }
    async updateProductAttributes(prisma, productId, attributes) {
        const existingAttributes = await prisma.productAttributes.findMany({
            where: { productId },
        });
        const toCreate = attributes.filter((attr) => !existingAttributes.some((ex) => ex.categoryAttributeId === attr.categoryAttributeId));
        const toUpdate = attributes.filter((attr) => existingAttributes.some((ex) => ex.categoryAttributeId === attr.categoryAttributeId));
        const toDelete = existingAttributes.filter((ex) => !attributes.some((attr) => attr.categoryAttributeId === ex.categoryAttributeId));
        if (toDelete.length > 0) {
            await prisma.productAttributes.deleteMany({
                where: {
                    id: { in: toDelete.map((attr) => attr.id) },
                },
            });
        }
        if (toCreate.length > 0) {
            await prisma.productAttributes.createMany({
                data: toCreate.map((attr) => ({
                    value: String(attr.value),
                    title: attr.title,
                    categoryAttributeId: attr.categoryAttributeId,
                    productId,
                })),
            });
        }
        for (const attr of toUpdate) {
            const existingAttr = existingAttributes.find((ex) => ex.categoryAttributeId === attr.categoryAttributeId);
            if (existingAttr) {
                await prisma.productAttributes.update({
                    where: { id: existingAttr.id },
                    data: { value: String(attr.value) },
                });
            }
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        price_history_service_1.PriceHistoryService,
        s3_service_1.S3Service])
], ProductsService);
//# sourceMappingURL=products.service.js.map