import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { verify } from 'argon2';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  ACCESS_TOKEN_EXPIRES_IN = '1h';
  REFRESH_TOKEN_EXPIRES_IN = '30d';
  EXPIRE_DAY_REFRESH_TOKEN = 30;
  ACCESS_TOKEN_EXPIRES_IN_ADMIN = '30m';
  REFRESH_TOKEN_EXPIRES_IN_ADMIN = '7d';
  EXPIRE_DAY_REFRESH_TOKEN_ADMIN = 7;
  REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(
    private jwt: JwtService,
    @Inject(forwardRef(() => UsersService)) // Use forwardRef to handle circular dependency
    private usersService: UsersService,
  ) {}

  async adminLogin(dto: CreateUserDto) {
    const user = await this.validateUser(dto, true);
    const tokens = this.issueTokens(user.id, user.role);
    return {
      user,
      ...tokens,
    };
  }
  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);

    const tokens = this.issueTokens(user.id, user.role);
    return {
      user,
      ...tokens,
    };
  }
  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const tokens = this.issueTokens(user.id, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    try {
      const result = await this.jwt.verifyAsync(refreshToken);
      if (!result) throw new UnauthorizedException('Неверный токен обновления');

      const user = await this.usersService.checkUser(result.id, 'id');
      const tokens = this.issueTokens(user.id, user.role);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }

  private issueTokens(userId: string, role: string) {
    const data = { id: userId, role: role };

    const accessToken = this.jwt.sign(data, {
      expiresIn:
        role === UserRole.USER
          ? this.ACCESS_TOKEN_EXPIRES_IN
          : this.ACCESS_TOKEN_EXPIRES_IN_ADMIN,
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn:
        role === UserRole.USER
          ? this.REFRESH_TOKEN_EXPIRES_IN
          : this.REFRESH_TOKEN_EXPIRES_IN_ADMIN,
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: CreateUserDto, admin: boolean = false) {
    const user = await this.usersService.checkUser(dto.email, 'email');
    if (!user) throw new NotFoundException('Пользователь не найден');

    if (admin && user.role === UserRole.USER)
      throw new UnauthorizedException('Вы не являетесь администратором');
    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Неверный пароль');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  addRefreshTokenToResponse(
    res: Response,
    refreshToken: string,
    role: UserRole,
  ) {
    const expiresIn = new Date();
    expiresIn.setDate(
      expiresIn.getDate() +
        (role === UserRole.USER
          ? this.EXPIRE_DAY_REFRESH_TOKEN
          : this.EXPIRE_DAY_REFRESH_TOKEN_ADMIN),
    );
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }
  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
