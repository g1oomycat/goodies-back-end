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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const argon2_1 = require("argon2");
const cart_service_1 = require("../cart/cart.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(jwt, usersService, cartService) {
        this.jwt = jwt;
        this.usersService = usersService;
        this.cartService = cartService;
        this.ACCESS_TOKEN_EXPIRES_IN = '1h';
        this.REFRESH_TOKEN_EXPIRES_IN = '30d';
        this.EXPIRE_DAY_REFRESH_TOKEN = 30;
        this.ACCESS_TOKEN_EXPIRES_IN_ADMIN = '30m';
        this.REFRESH_TOKEN_EXPIRES_IN_ADMIN = '7d';
        this.EXPIRE_DAY_REFRESH_TOKEN_ADMIN = 7;
        this.REFRESH_TOKEN_NAME = 'refreshToken';
    }
    async adminLogin(dto) {
        const user = await this.validateUser(dto, true);
        const tokens = this.issueTokens(user.id, user.role);
        return {
            user,
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.validateUser(dto);
        const tokens = this.issueTokens(user.id, user.role);
        return {
            user,
            ...tokens,
        };
    }
    async register(dto) {
        const user = await this.usersService.create(dto);
        const tokens = this.issueTokens(user.id, user.role);
        await this.cartService.create(user.id);
        return {
            user,
            ...tokens,
        };
    }
    async getNewTokens(refreshToken) {
        try {
            const result = await this.jwt.verifyAsync(refreshToken);
            if (!result)
                throw new common_1.UnauthorizedException('Неверный токен обновления');
            const user = await this.usersService.checkUser(result.id, 'id');
            const tokens = this.issueTokens(user.id, user.role);
            return {
                user,
                ...tokens,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token is invalid or expired');
        }
    }
    issueTokens(userId, role) {
        const data = { id: userId, role: role };
        const accessToken = this.jwt.sign(data, {
            expiresIn: role === client_1.UserRole.USER
                ? this.ACCESS_TOKEN_EXPIRES_IN
                : this.ACCESS_TOKEN_EXPIRES_IN_ADMIN,
        });
        const refreshToken = this.jwt.sign(data, {
            expiresIn: role === client_1.UserRole.USER
                ? this.REFRESH_TOKEN_EXPIRES_IN
                : this.REFRESH_TOKEN_EXPIRES_IN_ADMIN,
        });
        return { accessToken, refreshToken };
    }
    async validateUser(dto, admin = false) {
        const user = await this.usersService.checkUser(dto.email, 'email');
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        if (admin && user.role === client_1.UserRole.USER)
            throw new common_1.UnauthorizedException('Вы не являетесь администратором');
        const isValid = await (0, argon2_1.verify)(user.password, dto.password);
        if (!isValid)
            throw new common_1.UnauthorizedException('Неверный пароль');
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    addRefreshTokenToResponse(res, refreshToken, role) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() +
            (role === client_1.UserRole.USER
                ? this.EXPIRE_DAY_REFRESH_TOKEN
                : this.EXPIRE_DAY_REFRESH_TOKEN_ADMIN));
        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: expiresIn,
            secure: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
        });
    }
    removeRefreshTokenToResponse(res) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(0),
            secure: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        cart_service_1.CartService])
], AuthService);
//# sourceMappingURL=auth.service.js.map