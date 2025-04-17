import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

// 👇 Этот хелпер загружает переменные из *_FILE
// function loadSecretsFromFiles() {
//   Object.keys(process.env).forEach((key) => {
//     console.log(key, 'key');

//     if (key.endsWith('_FILE')) {
//       const realKey = key.slice(0, -5);
//       const filePath = process.env[key];
//       console.log(realKey, 'realKey');

//       if (filePath && fs.existsSync(filePath)) {
//         process.env[realKey] = fs.readFileSync(filePath, 'utf8').trim();
//         console.log(process.env[realKey], 'process.env[realKey]');
//       }
//     }
//   });
// }

// 👇 Вызови перед стартом приложения
// loadSecretsFromFiles();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin =
    configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Преобразует входные объекты в экземпляры классов
      // transformOptions: { enableImplicitConversion: true }, // Позволяет преобразовывать типы
    }),
  );

  await app.listen(4200);
}
bootstrap();
