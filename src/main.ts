import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

import { LoggingService } from './modules/logging/logging.service';
import { AppModule } from './app.module';

const handleUncaughtErrors = () => {
  const logger = new LoggingService();

  process
    .on('unhandledRejection', (reason) => {
      logger.error(`Unhandled rejection: ${reason}`);
    })
    .on('uncaughtException', (error) => {
      logger.error(`Uncaught exception: ${error}`);
      process.exit(1);
    });
};

const initSwagger = async (app: INestApplication) => {
  const openAPI = await readFile(resolve(__dirname, '../doc/api.yaml'), 'utf8');
  const document = yaml.load(openAPI);
  SwaggerModule.setup('doc', app, document);
};

const initGlobalEntities = (app: INestApplication) => {
  app.useLogger(new LoggingService());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  initGlobalEntities(app);
  handleUncaughtErrors();

  await initSwagger(app);
  await app.listen(port, () => console.log(`Listening on port ${port}`));
};

bootstrap();
