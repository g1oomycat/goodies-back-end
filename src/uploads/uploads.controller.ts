import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/users/decorators/roles.decorator';
import { RolesGuard } from 'src/users/guards/roles.guard';
// import { SharpPipe } from './pipes/sharp.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IEntityType } from './types/entity-type';
import { UploadsService } from './uploads.service';

@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Auth()
@Controller('admin/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // @Get()
  // getAll(@Query('productId') productId?: string) {
  //   return this.uploadsService.findAll(productId);
  // }

  // @Get(':id')
  // @Auth()
  // getOne(@Param('id') id: string) {
  //   return this.uploadsService.findOne(id);
  // }

  @Post(':entityType')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadImages(
    @Param('entityType') entityType: IEntityType,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // Макс 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    images: Express.Multer.File[],
  ) {
    return this.uploadsService.uploadImages(entityType, images);
  }
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // @Delete(':id')
  // @Auth()
  // delete(@Param('id') id: string) {
  //   return this.uploadsService.delete(id);
  // }

  // @UsePipes(new ValidationPipe())
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  // @Delete('bulk/delete')
  // @Auth()
  // deleteBulk(@Body() listId: string[]) {
  //   return this.uploadsService.deleteBulk(listId);
  // }
}
