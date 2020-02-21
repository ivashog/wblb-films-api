export type EnvType = 'development' | 'production' | 'testing';

export interface AppConfig {
    env: EnvType;
    appName: string;
    version: string;
    description: string;
    isProduction: boolean;
    port: number;
    host: string;
    apiPrefix?: string;
    apiDocsPath?: string;
}
