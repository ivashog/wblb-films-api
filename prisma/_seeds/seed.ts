#!/usr/bin/env node

import yargs, { Argv } from 'yargs';
import { PrismaClient } from '@prisma/client';
import { appendFileSync, readFileSync } from 'fs';
import path from 'path';

export type SeederFn<T extends object> = (prisma: PrismaClient) => Promise<(void | T)[]>;
export type Seeders = {
    [seeder: string]: SeederFn<any>;
};

const argv = yargs.options('environment', {
    alias: 'env',
    default: 'development',
    description: 'Name of environment (must matches with seeds folder)',
}).argv;

const env = argv.environment;
console.info('--env', env);

const main = async () => {
    const prisma = new PrismaClient();
    const seeders: Seeders = await import(`./${env}`);

    await Promise.all(
        Object.entries(seeders).map(([seederName, seederFn]) => {
            writeSeedLockfile(seederName);
            return seederFn(prisma);
        }),
    );
    console.log('\n>> DONE!');

    await prisma.$disconnect();
};

const writeSeedLockfile = (seederName: string): void => {
    const LOCKFILE_PATH = path.resolve(__dirname, 'seed.lock');
    const seedLog = `${Date.now()}-${seederName}`;
    const lockfile = readFileSync(LOCKFILE_PATH, { encoding: 'utf-8' });

    if (!lockfile.includes(seederName)) {
        appendFileSync(LOCKFILE_PATH, '\n' + seedLog);
        console.log('+ ', seedLog);
    }
};

main();
