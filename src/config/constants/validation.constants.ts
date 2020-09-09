/**
 * Validation regexp of string describing a time span
 * @see https://github.com/zeit/ms/blob/adf1eb282d29fe3c405d205a3854177b86a97c1f/index.js#L53
 * @type {RegExp}
 */
export const zeitMsRegexp = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i;

/**
 * Available Typeorm Logger options.
 * @see https://github.com/typeorm/typeorm/blob/90b406581d55223afa4472eb812d7f9ed2dce73c/src/logger/LoggerOptions.ts#L4
 * @type {("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")[]}
 */
export const availableTypeormLoggerOptions: string[] = [
    'query',
    'schema',
    'error',
    'warn',
    'info',
    'log',
    'migration',
];
