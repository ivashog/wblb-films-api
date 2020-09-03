import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, configValidationSchema, databaseConfig, DB_CONFIG_TOKEN } from './config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { FilmsModule } from './films/films.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.resolve(process.cwd(), `${process.env.NODE_ENV || 'development'}.env`),
            ignoreEnvFile: process.env.NODE_ENV === 'production', // it is used for heroku production deploy
            validationSchema: configValidationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
            load: [appConfig, databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => config.get<TypeOrmModuleOptions>(DB_CONFIG_TOKEN),
            inject: [ConfigService],
        }),
        FilmsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                transform: true,
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
