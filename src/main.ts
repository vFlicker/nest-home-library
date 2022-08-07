import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

import { AppModule } from './app.module';
import { CustomLogger } from './common/utils';

const initSwagger = async (app: INestApplication) => {
  const openAPI = await readFile(resolve(__dirname, '../doc/api.yaml'), 'utf8');
  const document = yaml.load(openAPI);
  SwaggerModule.setup('doc', app, document);
};

const handleUncaughtErrors = (logger: Logger) => {
  process
    .on('unhandledRejection', (reason) => {
      logger.error(`Unhandled rejection: ${reason}`);
    })
    .on('uncaughtException', (error) => {
      logger.error(`Uncaught exception: ${error}`);
      process.exit(1);
    });
};

const initGlobalEntities = (app: INestApplication, logger: Logger) => {
  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  handleUncaughtErrors(logger);
};

const bootstrap = async () => {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  initGlobalEntities(app, logger);

  await initSwagger(app);
  await app.listen(port, () => console.log(`Listening on port ${port}`));
};

bootstrap();
