import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { appConfig, configValidationSchema } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { FilmsModule } from './films/films.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.resolve(
                process.cwd(),
                `${process.env.NODE_ENV || 'development'}.env`,
            ),
            ignoreEnvFile: process.env.NODE_ENV === 'production', // it is used for heroku production deploy
            validationSchema: configValidationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },
            load: [appConfig],
        }),
        PrismaModule,
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
        {
            provide: APP_FILTER,
            useClass: PrismaExceptionFilter,
        },
    ],
})
export class AppModule {}
