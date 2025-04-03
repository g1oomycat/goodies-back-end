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
exports.PriceHistoryService = void 0;
const common_1 = require("@nestjs/common");
const get_percentage_change_1 = require("../common/utils/get-percentage-change");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const prisma_service_1 = require("../prisma.service");
let PriceHistoryService = class PriceHistoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOne(id) {
        return this.prisma.priceHistory.findUnique({
            where: {
                id,
            },
        });
    }
    async getAll(productId, name, sortBy, sort, limit, page, includeStatus = true) {
        const where = {
            ...(productId ? { productId } : {}),
            ...(name
                ? { product: { name: { contains: name, mode: 'insensitive' } } }
                : {}),
        };
        const orderBy = sortBy ? { [sortBy]: sort } : {};
        const priceHistoryList = await this.prisma.priceHistory.findMany({
            where,
            orderBy,
            ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
            include: {
                product: {
                    include: {
                        category: includeStatus,
                        reviews: includeStatus,
                    },
                },
            },
        });
        const totalCount = await this.prisma.priceHistory.count({ where });
        return {
            page,
            limit,
            totalCount,
            resultCount: priceHistoryList.length,
            result: priceHistoryList,
        };
    }
    async create(dto, includeStatus = true) {
        const { productId, ...data } = dto;
        const percentageChange = (0, get_percentage_change_1.GetPercentageChange)(data.newPrice, data.oldPrice);
        const priceChange = data.oldPrice - data.newPrice;
        return this.prisma.priceHistory.create({
            data: {
                ...data,
                percentageChange,
                priceChange,
                product: {
                    connect: {
                        id: productId,
                    },
                },
            },
            include: {
                product: {
                    include: {
                        category: includeStatus,
                        reviews: includeStatus,
                    },
                },
            },
        });
    }
    async delete(id) {
        return this.prisma.priceHistory.delete({
            where: { id },
        });
    }
};
exports.PriceHistoryService = PriceHistoryService;
exports.PriceHistoryService = PriceHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PriceHistoryService);
//# sourceMappingURL=price-history.service.js.map