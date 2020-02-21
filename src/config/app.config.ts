import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';

import { AppConfig, EnvType } from './interfaces';
import { APP_CONFIG_TOKEN } from './constants';

export const appConfig = registerAs(
    APP_CONFIG_TOKEN,
    (): AppConfig => {
        const appPackage = readFileSync(`${process.cwd()}/package.json`, {
            encoding: 'utf8',
        });
        const appData = JSON.parse(appPackage);

        return {
            env: process.env.NODE_ENV as EnvType,
            appName: '🎬 ' + appData.name,
            version: appData.version,
            description: appData.description,
            isProduction: process.env.NODE_ENV === 'production',
            port: Number.parseInt(process.env.APP_PORT, 10),
            host: process.env.APP_HOST,
            apiDocsPath: process.env.API_DOCS_PATH,
        };
    },
);
