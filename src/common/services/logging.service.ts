import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EOL } from 'os';
import * as fs from 'fs/promises';

import { checkStart, getLogLevel, getLogSeparate } from '../utils';

const LOG_DIR = 'logs';
const LOG_ERROR_DIR = 'logs/error';

const createLogFileName = (): string => `log_${Date.now()}.log`;
const createErrorLogFileName = (): string => `error_${Date.now()}.log`;

@Injectable()
export class LoggingService {
  private level: LogLevel[];
  private separate: boolean;

  constructor(configService: ConfigService) {
    const levelEnv = configService.get('LOGGER_LEVEL');
    const separateEnv = configService.get('LOGGER_SEPARATE');

    this.level = getLogLevel(levelEnv);
    this.separate = getLogSeparate(separateEnv);
  }

  async createLog(log) {
    if (!this.level.includes(log.level)) return;

    const logString = `[NEST] ${new Date().toUTCString()} [Level: ${
      log.level
    }] Context: ${log.context} Message: ${log.message}${EOL}`;
    const logErrorString = `Created errors file ${EOL}`;
    const size = Number(process.env.LOGGER_MAX_FILE_SIZE);

    try {
      if (checkStart(log.context)) return;

      if (this.separate && log.level === 'error') {
        const files = await fs.readdir(LOG_ERROR_DIR);
        const currentFile = files[files.length - 1];

        if (!currentFile) {
          await this.createFile(
            logString,
            0,
            size,
            createErrorLogFileName(),
            LOG_ERROR_DIR,
          );
        } else {
          const lastFileStat = await fs.stat(`${LOG_ERROR_DIR}/${currentFile}`);
          const lastFileSize = lastFileStat.size;
          await this.createFile(
            logString,
            lastFileSize,
            size,
            currentFile,
            LOG_ERROR_DIR,
          );
        }
      }

      const files = await fs.readdir(LOG_DIR);
      const currentFile = files[files.length - 1];
      if (!currentFile) {
        await this.createFile(logString, 0, size, createLogFileName(), LOG_DIR);
      } else {
        const lastFileStat = await fs.stat(`${LOG_DIR}/${currentFile}`);
        const lastFileSize = lastFileStat.size;
        await this.createFile(
          logString,
          lastFileSize,
          size,
          currentFile,
          LOG_DIR,
        );
      }
    } catch (error) {
      await fs.mkdir(LOG_DIR);
      await fs.mkdir(LOG_ERROR_DIR);
      await this.createFile(logString, 0, size, createLogFileName(), LOG_DIR);
      await this.createFile(
        logErrorString,
        0,
        size,
        createErrorLogFileName(),
        LOG_ERROR_DIR,
      );
    }
  }

  async createFile(logString, lastFileSize, size, currentFile, path) {
    if (lastFileSize >= size - 1024) {
      try {
        await fs.writeFile(`${path}/${createLogFileName()}`, logString);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await fs.appendFile(`${path}/${currentFile}`, logString);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
