import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: function (origin, callback) {
      if (
        !origin ||
        configService?.getAllowedDomains()?.indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS  ${origin}`));
      }
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.getPort() ?? 3000);
}
bootstrap();
