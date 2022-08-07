import { Request } from 'express';

export const getFullUrl = (req: Request) => {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};
