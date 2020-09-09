import { Injectable, ValidationError } from '@nestjs/common';
import { plainToClass, TransformPlainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SortOrder } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorCodesEnum } from '../prisma/prisma-error-codes.enum';
import { FilmNotFoundException } from './exceptions/film-not-found.exception';
import { CreateFilmConflictException } from './exceptions/create-film-conflict.exception';
import { flattenValidationErrors } from '../shared/exceptions/exception.factory';

import { RawFilm, RawFilmDto } from './dtos/input/raw-film.dto';
import { CreateFilmDto } from './dtos/input/create-film.dto';
import { CreatedFilmResponseDto } from './dtos/output/created-film-response.dto';
import { FilmsImportResponseDto } from './dtos/output/films-import-response.dto';
import { SearchFilmsDto } from './dtos/input/search-films.dto';
import { FilmResponseDto } from './dtos/output/film-response.dto';
import { FilmDetailResponseDto } from './dtos/output/film-detail-response.dto';

@Injectable()
export class FilmsService {
    constructor(private readonly prisma: PrismaService) {}

    @TransformPlainToClass(FilmResponseDto)
    getList(order: SortOrder) {
        return this.prisma.film.findMany({
            select: {
                id: true,
                name: true,
                releaseYear: true,
                format: { select: { name: true } },
                actors: { select: { fullName: true } },
            },
            orderBy: { name: order },
        });
    }

    @TransformPlainToClass(CreatedFilmResponseDto)
    async createOne(createFilmDto: CreateFilmDto) {
        const { formatName, actorsList, ...filmData } = createFilmDto;

        try {
            return await this.prisma.film.create({
                select: { id: true, name: true, actors: true },
                data: filmData,
            });
        } catch (err) {
            if (err.code === PrismaErrorCodesEnum.UniqueKeyViolation) {
                const { name, releaseYear } = filmData;
                throw new CreateFilmConflictException({ name, releaseYear });
            }
            throw err;
        }
    }

    @TransformPlainToClass(FilmDetailResponseDto)
    async getById(id: number) {
        const film = await this.prisma.film.findOne({
            select: {
                id: true,
                name: true,
                releaseYear: true,
                createdAt: true,
                actors: true,
                format: { select: { name: true } },
            },
            where: { id },
        });

        if (!film) throw new FilmNotFoundException({ id });

        return film;
    }

    @TransformPlainToClass(FilmResponseDto)
    async search(searchFilmDto: SearchFilmsDto) {
        const { name, actor } = searchFilmDto;
        return this.prisma.film.findMany({
            select: {
                id: true,
                name: true,
                releaseYear: true,
                format: { select: { name: true } },
                actors: { select: { fullName: true } },
            },
            where: {
                name: { contains: name, mode: 'insensitive' },
                actors: { some: { fullName: { contains: actor, mode: 'insensitive' } } },
            },
            orderBy: [{ releaseYear: SortOrder.desc }, { name: SortOrder.asc }],
        });
    }

    async delete(id: number) {
        const existFilm = await this.prisma.film.findOne({
            select: { id: true },
            where: { id },
        });

        if (!existFilm) throw new FilmNotFoundException({ id });

        return this.prisma.film.delete({ select: null, where: { id: existFilm.id } });
    }

    async batchCreate(rawFilmsData: RawFilmDto[]): Promise<FilmsImportResponseDto> {
        const response = new FilmsImportResponseDto();

        for await (const rawFilm of rawFilmsData) {
            const filmDto = plainToClass(CreateFilmDto, rawFilm);
            const errors = await validate(filmDto);
            if (errors.length > 0) {
                response.errors.push({
                    value: rawFilm,
                    error: flattenValidationErrors(errors as ValidationError[]),
                });
                continue;
            }

            const { formatName, actorsList, ...filmData } = filmDto;
            const upsertedFilm = await this.prisma.film.upsert({
                select: { id: true, name: true, actors: true },
                where: {
                    name_releaseYear: {
                        name: filmData.name,
                        releaseYear: filmData.releaseYear,
                    },
                },
                create: filmData,
                update: filmData,
            });

            response.data.push(plainToClass(CreatedFilmResponseDto, upsertedFilm));
        }

        return response;
    }

    public parseTxt(file: Buffer): RawFilmDto[] {
        const ROWS_SEPARATOR = '\r\n';
        const ATTR_SEPARATOR = /:\s(.+)/; // this regexp need for process values with ': ' symbols
        const FILM_PARSER_SCHEMA: RawFilm = {
            name: 'Title',
            releaseYear: 'Release Year',
            formatName: 'Format',
            actorsList: 'Stars',
        };
        const txtData: string = file.toString('utf8');
        const filmsRawItems: string[] = txtData.split(ROWS_SEPARATOR.repeat(2)).filter(i => i);

        return filmsRawItems.map(rawFilm =>
            rawFilm.split(ROWS_SEPARATOR).reduce((filmObj: RawFilmDto, filmAttr) => {
                const [parseKey, parseValue = ''] = filmAttr.split(ATTR_SEPARATOR);
                const [objKey] = Object.entries(FILM_PARSER_SCHEMA).find(
                    ([, rawKey]) => rawKey === parseKey,
                ) || [parseKey];
                if (!objKey) return filmObj;
                return { ...filmObj, [objKey]: parseValue.trim() };
            }, new RawFilmDto()),
        );
    }
}
