import * as Joi from '@hapi/joi';

import { availableTypeormLoggerOptions, zeitMsRegexp } from './constants';

export const configValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'testing')
        .default('development'),
    APP_PORT: Joi.number()
        .port()
        .default(3000),
    APP_HOST: Joi.string()
        .hostname()
        .default('localhost'),
    API_DOCS_PATH: Joi.string()
        .uri({ relativeOnly: true })
        .default('/swagger'),
    API_PREFIX: Joi.string()
        .uri({ relativeOnly: true })
        .default('api/v1'),
    JWT_SECRET: Joi.string()
        .min(20)
        .required(),
    /**
     * Jwt token expiration time.
     * @member {string} - expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).
     * @example 60, "2 days", "10h", "7d" etc.
     */
    JWT_EXPIRATION: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
            .pattern(zeitMsRegexp)
            .default('60 seconds'),
    ),
    TYPEORM_CONNECTION: Joi.string()
        .valid('postgres', 'cockroachdb')
        .default('postgres'),
    TYPEORM_HOST: Joi.string()
        .hostname()
        .default('localhost'),
    TYPEORM_PORT: Joi.number()
        .port()
        .default(5432),
    TYPEORM_USERNAME: Joi.string().default('postgres'),
    TYPEORM_PASSWORD: Joi.string().required(),
    TYPEORM_DATABASE: Joi.string().default('postgres'),
    TYPEORM_SCHEMA: Joi.string().default('public'),
    TYPEORM_SYNCHRONIZE: Joi.boolean().default(false),
    TYPEORM_LOGGING: Joi.alternatives()
        .try(Joi.boolean(), Joi.string().valid('all'), Joi.string().valid(...availableTypeormLoggerOptions))
        .default('all'),
    TYPEORM_ENTITIES: Joi.string()
        .uri({ relativeOnly: true })
        .required(),
    TYPEORM_MIGRATIONS: Joi.string().uri({ relativeOnly: true }),
    TYPEORM_MIGRATIONS_DIR: Joi.string().uri({ relativeOnly: true }),
    TYPEORM_MIGRATIONS_RUN: Joi.boolean().default(false),
});
