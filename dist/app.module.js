"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const cart_module_1 = require("./cart/cart.module");
const categories_module_1 = require("./categories/categories.module");
const s3_config_1 = require("./config/s3.config");
const banners_module_1 = require("./banners/banners.module");
const favorites_module_1 = require("./favorites/favorites.module");
const orders_module_1 = require("./orders/orders.module");
const price_history_module_1 = require("./price-history/price-history.module");
const products_module_1 = require("./products/products.module");
const promotions_module_1 = require("./promotions/promotions.module");
const reviews_instagram_module_1 = require("./reviews-instagram/reviews-instagram.module");
const uploads_module_1 = require("./uploads/uploads.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [s3_config_1.default],
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            orders_module_1.OrdersModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            price_history_module_1.PriceHistoryModule,
            uploads_module_1.UploadsModule,
            cart_module_1.CartModule,
            reviews_instagram_module_1.ReviewsInstagramModule,
            favorites_module_1.FavoritesModule,
            banners_module_1.BannersModule,
            promotions_module_1.PromotionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map