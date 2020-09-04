import { PrismaClient, FilmFormat, FilmFormatCreateInput } from '@prisma/client';
import { SeederFn } from '../seed';

const filmFormatsData: FilmFormatCreateInput[] = [{ name: 'VHS' }, { name: 'DVD' }, { name: 'Blu-Ray' }];

export const fillDictsSeed01: SeederFn<FilmFormat> = (prisma: PrismaClient) =>
    Promise.all(
        filmFormatsData.map(format =>
            prisma.filmFormat
                .upsert({
                    create: format,
                    update: format,
                    where: {
                        name: format.name,
                    },
                })
                .catch(console.error),
        ),
    );
