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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsInstagramController = void 0;
const common_1 = require("@nestjs/common");
const get_boolean_1 = require("../common/utils/get-boolean");
const reviews_instagram_service_1 = require("./reviews-instagram.service");
let ReviewsInstagramController = class ReviewsInstagramController {
    constructor(reviewsInstagramService) {
        this.reviewsInstagramService = reviewsInstagramService;
    }
    async getAll(name, nick, isActive, page = '1', limit = '20', sortBy = 'position', sort = 'desc') {
        console.log(isActive);
        return this.reviewsInstagramService.getAll(name, nick, (0, get_boolean_1.getBoolean)(isActive), sortBy, sort, parseInt(limit, 10) || undefined, parseInt(page, 10) || undefined);
    }
};
exports.ReviewsInstagramController = ReviewsInstagramController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('nick')),
    __param(2, (0, common_1.Query)('isActive')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReviewsInstagramController.prototype, "getAll", null);
exports.ReviewsInstagramController = ReviewsInstagramController = __decorate([
    (0, common_1.Controller)('reviews-instagram'),
    __metadata("design:paramtypes", [reviews_instagram_service_1.ReviewsInstagramService])
], ReviewsInstagramController);
//# sourceMappingURL=reviews-instagram.controller.js.map