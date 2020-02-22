/**
 * This ormconfig file using for configure
 * TypeORM migrations and typeorm-seeding CLI
 * If you want use them:
 *  1. Rename this file to ormconfig.js
 *  2. Fill it by valid values
 */

/**
 * Import you custom naming strategy for using with TypeORM migrations CLI.
 * Delete if you don't wont use it.
 */
const SnakeNamingStrategy = require('./dist/shared/database/snake-naming.strategy').SnakeNamingStrategy;

module.exports = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    ssl: false,
    username: "postgres",
    password: "you_password",
    database: "you_db",
    schema: "public",
    synchronize: false,
    logging: "all",
    entities: ["dist/!(shared)/**/*.entity.js"],
    migrations: ["dist/database/migrations/*.js"],
    cli: {
        migrationsDir: "src/database/migrations"
    },
    /** Using you custom naming strategy */
    namingStrategy: new SnakeNamingStrategy(),
    /**
     * Following props is using for typeorm-seeding CLI
     * @see https://github.com/w3tecch/typeorm-seeding
     */
//    seeds: ["src/database/seeds/**/*.seed.ts"],
//    factories: ["src/database/factories/**/*.factory.ts"]
};
