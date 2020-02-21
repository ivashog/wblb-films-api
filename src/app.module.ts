import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, configValidationSchema, databaseConfig, DB_CONFIG_TOKEN } from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            // isGlobal: true,
            envFilePath: path.resolve(process.cwd(), `${process.env.NODE_ENV || 'development'}.env`),
            validationSchema: configValidationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
            load: [appConfig, databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(databaseConfig)],
            useFactory: (config: ConfigService) => config.get<TypeOrmModuleOptions>(DB_CONFIG_TOKEN),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
