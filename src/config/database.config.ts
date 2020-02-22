import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

import { SnakeNamingStrategy } from '../shared/database/snake-naming.strategy';

export const databaseConfig = registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: Number.parseInt(process.env.TYPEORM_PORT, 10),
        database: process.env.TYPEORM_DATABASE,
        schema: process.env.TYPEORM_SCHEMA,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        ssl: process.env.TYPEORM_DRIVER_EXTRA === '{"ssl":true}',
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: process.env.TYPEORM_LOGGING as LoggerOptions,
        entities: process.env.TYPEORM_ENTITIES.split(','),
        migrations: process.env.TYPEORM_MIGRATIONS.split(','),
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
        namingStrategy: new SnakeNamingStrategy(),
    }),
);
