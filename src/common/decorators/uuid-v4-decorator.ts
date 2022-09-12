import { ParseUUIDPipe } from '@nestjs/common';

export const uuidV4Decorator = new ParseUUIDPipe({ version: '4' });
