import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { UserRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

export class CreateUserByAdminDto extends IntersectionType(
  CreateUserDto,
  PartialType(OmitType(UpdateUserDto, ['email'] as const)),
) {
  @IsEnum(UserRole)
  role: UserRole;
}
