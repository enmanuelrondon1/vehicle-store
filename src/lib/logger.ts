// src/lib/logger.ts

const isProduction = process.env.NODE_ENV === 'production';

interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
}

// En producción, la mayoría de los logs estarán deshabilitados para no saturar.
const disabledLogger: Partial<Logger> = {
  log: () => {},
  info: () => {},
};

export const logger: Logger = isProduction
  ? {
      ...console,
      ...disabledLogger,
    }
  : console;