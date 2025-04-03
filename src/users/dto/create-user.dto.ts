import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
  @IsString()
  password: string;
}
