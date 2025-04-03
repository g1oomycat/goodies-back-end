// import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as sharp from 'sharp';
// import { v4 as uuid } from 'uuid';

// @Injectable()
// export class SharpPipe
//   implements PipeTransform<Express.Multer.File[], Promise<string[]>>
// {
//   constructor(private entityType: string) {}

//   async transform(images: Express.Multer.File[]): Promise<string[]> {
//     const fileNameList = [];
//     if (!fs.existsSync('uploads')) {
//       fs.mkdirSync('uploads');
//     }
//     if (images.length > 6)
//       throw new BadRequestException(
//         `Количество загружаемый фотографий (${images.length}) больше (6)`,
//       );
//     for (const image of images) {
//       const fileName = `${uuid()}.webp`;
//       const outputPath = path.join('uploads', fileName);

//       await sharp(image.path)
//         .resize(800)
//         .webp({ effort: 3 })
//         .toFile(outputPath);

//       fileNameList.push(fileName);
//     }

//     return fileNameList;
//   }
// }
