"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const price_history_controller_1 = require("./price-history.controller");
const price_history_service_1 = require("./price-history.service");
let PriceHistoryModule = class PriceHistoryModule {
};
exports.PriceHistoryModule = PriceHistoryModule;
exports.PriceHistoryModule = PriceHistoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [price_history_controller_1.AdminPriceHistoryController],
        providers: [price_history_service_1.PriceHistoryService, prisma_service_1.PrismaService],
        exports: [price_history_service_1.PriceHistoryService],
    })
], PriceHistoryModule);
//# sourceMappingURL=price-history.module.js.map