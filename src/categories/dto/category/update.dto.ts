import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
