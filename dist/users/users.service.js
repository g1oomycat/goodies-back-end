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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const argon2_1 = require("argon2");
const auth_service_1 = require("../auth/auth.service");
const get_skip_and_take_1 = require("../common/utils/get-skip-and-take");
const prisma_service_1 = require("../prisma.service");
const update_user_by_admin_dto_1 = require("./dto/update-user-by-admin.dto");
let UsersService = class UsersService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async getOne(uniqValue, identifier = 'id', includeStatus = true, returnWithPassword = false, adminRole) {
        const user = await this.prisma.users.findFirst({
            where: { [identifier]: uniqValue },
        });
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        if (returnWithPassword) {
            return user;
        }
        const { password, ...userWithoutPasswordAndRole } = user;
        return userWithoutPasswordAndRole;
    }
    async getAll(userId, email, firstName, lastName, phone, role, sortBy, sort, limit, page, adminRole) {
        if (adminRole && role) {
            this.validateRole(role, adminRole);
        }
        const where = {
            ...(userId ? { id: userId } : {}),
            ...(role ? { role } : {}),
            ...(adminRole !== client_1.UserRole.SUPER_ADMIN && !role
                ? { role: client_1.UserRole.USER }
                : {}),
            ...(email ? { name: { contains: email, mode: 'insensitive' } } : {}),
            ...(firstName
                ? { name: { contains: firstName, mode: 'insensitive' } }
                : {}),
            ...(lastName
                ? { name: { contains: lastName, mode: 'insensitive' } }
                : {}),
            ...(phone ? { name: { contains: phone, mode: 'insensitive' } } : {}),
        };
        const orderBy = sortBy ? { [sortBy]: sort } : {};
        const users = await this.prisma.users.findMany({
            where,
            orderBy,
            ...(0, get_skip_and_take_1.GetSkipAndPage)(page, limit),
        });
        const usersList = [];
        users.map((user) => {
            const { password, ...userWithoutPassword } = user;
            usersList.push(userWithoutPassword);
        });
        const totalCount = await this.prisma.users.count({ where });
        return {
            page,
            limit,
            totalCount,
            resultCount: usersList.length,
            result: usersList,
        };
    }
    async create(dto) {
        const isUser = await this.checkUser(dto.email, 'email');
        if (isUser)
            throw new common_1.BadRequestException('Пользователь уже существует');
        const user = await this.prisma.users.create({
            data: { ...dto, password: await (0, argon2_1.hash)(dto.password) },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async createByAdmin(dto, adminRole) {
        const isUser = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });
        if (isUser)
            throw new common_1.BadRequestException('Пользователь уже существует');
        this.validateRole(dto.role, adminRole);
        const user = await this.prisma.users.create({
            data: { ...dto, password: await (0, argon2_1.hash)(dto.password) },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async update(id, dto, adminRole) {
        const currentUser = await this.getOne(id, 'id');
        if (dto instanceof update_user_by_admin_dto_1.UpdateUserByAdminDto && adminRole) {
            console.log(adminRole);
            this.validateRole(currentUser.role, adminRole);
            if (dto.password) {
                dto.password = await (0, argon2_1.hash)(dto.password);
            }
        }
        const { password, role, ...user } = await this.prisma.users.update({
            where: {
                id,
            },
            data: dto,
        });
        return dto instanceof update_user_by_admin_dto_1.UpdateUserByAdminDto ? { ...user, role } : user;
    }
    async deleteUser(id, isAdmin, res, adminRole) {
        const currentUser = await this.getOne(id, 'id', false);
        if (isAdmin && adminRole) {
            this.validateRole(currentUser.role, adminRole);
        }
        if (!isAdmin && res) {
            this.authService.removeRefreshTokenToResponse(res);
        }
        return this.prisma.users.delete({
            where: { id },
        });
    }
    async deleteBulk({ ids }, adminRole) {
        const usersRole = await this.prisma.users.findMany({
            where: { id: { in: ids } },
            select: { role: true },
        });
        if (usersRole.length !== ids.length) {
            throw new common_1.NotFoundException('Некоторые пользователи не найдены');
        }
        usersRole.forEach((el) => this.validateRole(el.role, adminRole));
        return this.prisma.products.deleteMany({
            where: { id: { in: ids } },
        });
    }
    validateRole(targetRole, adminRole) {
        if (adminRole === client_1.UserRole.SUPER_ADMIN) {
            return;
        }
        if (adminRole === client_1.UserRole.ADMIN && targetRole === client_1.UserRole.USER) {
            return;
        }
        throw new common_1.ForbiddenException('Недостаточно прав');
    }
    async checkUser(uniqValue, identifier) {
        return this.prisma.users.findFirst({
            where: {
                [identifier]: uniqValue,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], UsersService);
//# sourceMappingURL=users.service.js.map