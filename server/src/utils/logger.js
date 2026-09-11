const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function getCurrentLevel() {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel && envLevel in LOG_LEVELS) return envLevel;
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

function shouldLog(level) {
  const current = getCurrentLevel();
  return (LOG_LEVELS[level] ?? 2) <= (LOG_LEVELS[current] ?? 2);
}

function serializeMeta(meta) {
  if (meta instanceof Error) {
    return {
      error: {
        name: meta.name,
        message: meta.message,
        stack: meta.stack,
        ...(meta.cause ? { cause: meta.cause } : {}),
        ...meta,
      },
    };
  }
  if (meta !== null && typeof meta === 'object') {
    return meta;
  }
  return meta !== undefined ? { context: meta } : {};
}

function formatLog(level, message, meta) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...serializeMeta(meta),
  });
}

function log(level, consoleMethod, message, meta) {
  if (shouldLog(level)) {
    consoleMethod(formatLog(level, message, meta));
  }
}

export const logger = {
  error: (message, meta) => log('error', console.error, message, meta),
  warn: (message, meta) => log('warn', console.warn, message, meta),
  info: (message, meta) => log('info', console.log, message, meta),
  debug: (message, meta) => log('debug', console.debug, message, meta),
};

export default logger;