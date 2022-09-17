import { Request, Response } from 'express';

const getFullUrl = (req: Request) => {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};

export const loggerLevels = [
  'error',
  'warn',
  'info',
  'verbose',
  'debug',
  'silly',
];

export const createRequestLogMessage = (
  request: Request,
  response: Response,
) => {
  const { body, query, ip, method } = request;
  const { statusCode, statusMessage } = response;

  const userAgent = request.get('user-agent') || '';
  const contentLength = response.get('content-length');

  const message = `Request info: method: ${method}, URL: ${getFullUrl(
    request,
  )} query params: ${JSON.stringify(query)}, body: ${JSON.stringify(
    body,
  )}, status code: ${statusCode}, status message: ${statusMessage}, content-length: ${contentLength} - ${userAgent} ${ip}`;

  return message;
};
