const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  info: (...args: any[]) => {
    if (!isProduction) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    // Optionally send to remote monitoring here
  },
  debug: (...args: any[]) => {
    if (!isProduction) {
      console.debug('[DEBUG]', ...args);
    }
  },
};

//TODO Register this logs into secured file instead on the console