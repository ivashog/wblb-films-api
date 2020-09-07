import { PrismaClient, Film, FilmCreateInput, Actor, ActorCreateInput } from '@prisma/client';
import { SeederFn } from '../seed';
import faker from 'faker/locale/uk';

const DEFAULT_FILMS_AMOUNT = 100;

const generateFakeActors = (count: number): ActorCreateInput[] =>
    new Array(count).fill(null).map(_ => ({
        fullName: faker.name.findName(),
    }));

const generateFakeFilms = (count: number): FilmCreateInput[] =>
    new Array(count).fill(null).map(_ => ({
        name: faker.commerce.productName(),
        releaseYear: faker.random.number({ min: 1920, max: 2020 }),
        format: { connect: { id: faker.random.number({ min: 1, max: 3 }) } },
    }));

export const generateFakeFilms02: SeederFn<FilmCreateInput> = async (
    prisma: PrismaClient,
    options?: Record<string, any>,
) => {
    const filmsAmount = options?.amount ?? DEFAULT_FILMS_AMOUNT;
    await Promise.all(
        generateFakeActors(Math.ceil(filmsAmount / 3)).map(actor => prisma.actor.create({ data: actor })),
    );
    const {
        max: { id: maxActorId },
    } = await prisma.actor.aggregate({ max: { id: true } });

    return Promise.all(
        generateFakeFilms(filmsAmount).map(film =>
            prisma.film.create({
                data: {
                    ...film,
                    actors: {
                        connect: new Array(faker.random.number({ min: 2, max: 10 })).fill(null).map(_ => ({
                            id: faker.random.number({ min: 1, max: maxActorId }),
                        })),
                    },
                },
            }),
        ),
    );
};
