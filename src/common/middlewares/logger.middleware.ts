import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { createRequestLogMessage } from '../utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    response.on('finish', () => {
      const { statusCode } = response;

      const message = createRequestLogMessage(request, response);

      if (statusCode >= 500) {
        this.logger.error(message);
        return;
      }

      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(message);
        return;
      }

      if (statusCode < 400) {
        this.logger.log(message);
        return;
      }
    });

    next();
  }
}
