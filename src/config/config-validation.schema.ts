import * as Joi from '@hapi/joi';

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
    DATABASE_URL: Joi.string().uri({ scheme: 'postgresql' }),
});
