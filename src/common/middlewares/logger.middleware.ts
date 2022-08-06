import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { getFullUrl } from '../utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    this.logger.log(`Url: ${getFullUrl(request)}`);
    this.logger.log(`Query parameters: ${JSON.stringify(request.query)}`);
    this.logger.log(`Body: ${JSON.stringify(request.body)}`);

    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(`Status code: ${statusCode}`);
    });

    next();
  }
}
