import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

import { LoggingService } from './modules/logging/logging.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);

  const openAPI = await readFile(resolve(__dirname, '../doc/api.yaml'), 'utf8');
  const document = yaml.load(openAPI);
  SwaggerModule.setup('doc', app, document);

  app.useLogger(new LoggingService());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(configService.get('PORT') || 4000);
}
bootstrap();
