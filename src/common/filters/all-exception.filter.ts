import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  LogLevel,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError as PrismaException } from '@prisma/client/runtime';

@Catch(HttpException, PrismaException)
export class AllExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  catch(exception: HttpException | PrismaException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, response);
    }

    if (exception instanceof PrismaException) {
      return this.handlePrismaException(exception, response);
    }
  }

  private handleHttpException(exception: HttpException, response: Response) {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as { message: string[] };
    const message = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message
      : exception.message;
    const body = { statusCode, message };

    response.status(statusCode).json(body);

    this.logger.error(exception.message, exception.stack);
  }

  private handlePrismaException(
    exception: PrismaException,
    response: Response,
  ) {
    switch (exception.code) {
      case 'P2002': {
        const statusCode = HttpStatus.FORBIDDEN;
        const message = 'Incorrect credentials';
        const body = { statusCode, message };

        response.status(statusCode).json(body);
        break;
      }

      case 'P2025': {
        const statusCode = HttpStatus.NOT_FOUND;
        const message = 'Record not found';
        const body = { statusCode, message };

        response.status(statusCode).json(body);
        break;
      }

      default: {
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = 'Internal server error';
        const body = { statusCode, message };

        response.status(statusCode).json(body);
        break;
      }
    }

    this.logger.error(exception.message, exception.stack);
  }
}
