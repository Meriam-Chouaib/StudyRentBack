import { pino } from 'pino';
import { config } from '../config/config';

const transport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true },
});

const parse = (data: any) => {
  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2);
  }
  return data;
};

const getLogMessage = (data: any, namespace?: string) => {
  const parsedData = parse(data);
  if (namespace) {
    return ` [${namespace}] ${parsedData}`;
  }

  return parsedData;
};

const logger = pino(transport);

const isDevelopmentMode = config.ENV === 'development';

export const info = (data: any, namespace?: string) => {
  if (isDevelopmentMode) logger.info(getLogMessage(data, namespace));
};

export const warn = (data: any, namespace?: string) => {
  if (isDevelopmentMode) logger.warn(getLogMessage(data, namespace));
};

export const error = (data: any, namespace?: string) => {
  if (isDevelopmentMode) logger.error(getLogMessage(data, namespace));
};

export const debug = (data: any, namespace?: string) => {
  if (isDevelopmentMode) logger.debug(getLogMessage(data, namespace));
};
