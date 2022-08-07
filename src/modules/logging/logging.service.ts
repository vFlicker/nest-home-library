import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

export const getLogLevels = (isProduction: boolean): LogLevel[] => {
  if (isProduction) return ['log', 'warn', 'error'];
  return ['error', 'warn', 'log', 'debug'];
};

@Injectable()
export class LoggingService extends ConsoleLogger {
  private fileName = '';
  private fileSize: number;

  constructor(config: ConfigService) {
    super();

    this.setLogLevels(getLogLevels(config.get('NODE_ENV') === 'production'));
    this.fileSize = Number(config.get('FILE_SIZE'));
  }

  log(message: string, context?: string) {
    super.log.apply(this, [`\n${message}`, context]);
    this.writeLogToFile(message, 'log', context);
  }

  error(message: string, context?: string) {
    super.error.apply(this, [`\n${message}`, context]);
    this.writeLogToFile(message, 'error', context);
  }

  warn(message: string, context?: string) {
    super.warn.apply(this, [`\n${message}`, context]);
    this.writeLogToFile(message, 'warn', context);
  }

  debug(message: string, context?: string) {
    super.debug.apply(this, [`\n${message}`, context]);
  }

  private writeLogToFile = (
    message: string,
    type: string,
    context?: string,
  ): void => {
    const amended = `\n${type.toUpperCase()} ${
      context
        ? '[' + context + ']'
        : this.context
        ? '[' + this.context + ']'
        : ''
    } ${message}`;

    if (!this.fileName) {
      this.createFileAndSave(amended, this.context);
    } else {
      this.amendFile(amended, this.context);
    }
  };

  private createFileAndSave(message: string, context: string) {
    if (context) {
      this.fileName = `error_${context}_${Date.now()}.log`;
      fs.appendFile(this.fileName, `${message}`, 'utf8', (err) => {
        if (err) throw err;
      });
    }
  }

  private amendFile(message: string, context: string) {
    fs.stat(this.fileName, (err, stat) => {
      if (err) {
        const message = `Fail to open file ${this.fileName}`;
        super.log.apply(this, [message, context]);
      } else {
        const fileSize = stat.size;

        if (fileSize > this.fileSize) {
          this.fileName = `error_${context}_${Date.now()}.log`;
        }
        fs.appendFile(this.fileName, `${message}`, 'utf8', (err) => {
          if (err) throw err;
        });
      }
    });
  }
}
