import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfig, APP_CONFIG_TOKEN } from './config';

async function bootstrap() {
    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);

    const config: ConfigService = app.get(ConfigService);
    const { port, host, appName, version, description, isProduction, apiDocsPath } = config.get<AppConfig>(
        APP_CONFIG_TOKEN,
    );

    app.enableCors();

    if (isProduction) {
        /**
         * Used for security.
         * @see https://helmetjs.github.io/
         */
        app.use(helmet());
    }

    const protocol = isProduction ? 'https' : 'http';
    const serverUrl = `${protocol}://${host}${isProduction ? '' : ':' + port}`;

    const options = new DocumentBuilder()
        .setTitle(appName)
        .setDescription(description)
        .setVersion(version)
        .addServer(serverUrl, 'Current server')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(apiDocsPath, app, document);

    // tslint:disable
    /*
     * This hook isProduction ? process.env.PORT : port
     * used for deploying to Heroku, because Heroku dynamically
     * assigns your app a port, so you can't set the port to a fixed number.
     * Heroku adds the port to the env
     * @see https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
     */
    await app.listen(isProduction ? process.env.PORT : port);

    logger.log(`${appName} is listening at ${serverUrl}`);
    logger.log(`Swagger is exposed at ${serverUrl}${apiDocsPath}`);
}

bootstrap().catch(e => Logger.error(e));
