import { PartialType } from '@nestjs/mapped-types';

import { CreateUserByAdminDto } from './create-user-by-admin.dto';

export class UpdateUserByAdminDto extends PartialType(CreateUserByAdminDto) {}
