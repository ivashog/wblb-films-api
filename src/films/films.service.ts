import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { plainToClass, TransformClassToClass, TransformPlainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaClientKnownRequestError, SortOrder } from '@prisma/client';

import { FilmEntity } from '../database/entities/film.entity';
import { RawFilm, RawFilmDto } from './dtos/raw-film.dto';
import { CreateFilmDto } from './dtos/input/create-film.dto';
import { ActorEntity } from '../database/entities/actor.entity';
import { FilmActorEntity } from '../database/entities/film-actor.entity';
import { CreatedFilmResponseDto } from './dtos/output/created-film-response.dto';
import { FilmsImportResDto } from './dtos/films-import-res.dto';
import { SearchFilmsDto } from './dtos/search-films.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FilmResponseDto } from './dtos/output/film-response.dto';
import { PrismaErrorCodesEnum } from '../prisma/prisma-error-codes.enum';
import { EnumValues } from 'enum-values';

@Injectable()
export class FilmsService {
    constructor(
        private readonly connection: Connection,
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>,
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
        private readonly prisma: PrismaService,
    ) {}

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
    createOne(createFilmDto: CreateFilmDto) {
        const { formatName, actorsList, ...filmData } = createFilmDto;

        return this.prisma.film.create({
            select: { id: true, name: true, actors: true },
            data: filmData,
        });
    }

    @TransformClassToClass()
    async findOne(id: number): Promise<FilmEntity | undefined> {
        return await this.filmRepository.findOne(id);
    }

    async find(searchDto: SearchFilmsDto): Promise<FilmEntity[]> {
        const { name, actor } = searchDto;

        let qb = this.filmRepository
            .createQueryBuilder('film')
            .leftJoinAndSelect('film.actors', 'filmAct')
            .leftJoinAndSelect('filmAct.actor', 'actor')
            .orderBy('film.name', 'ASC')
            .addOrderBy('film.releaseYear', 'DESC');

        if (name) qb = qb.where(`film.name ILIKE '%${name}%'`);
        if (actor) qb = qb.where(`actor.fullName ILIKE '%${actor}%'`);

        return await qb.getMany();
    }

    // async create(filmDto: CreateFilmDto): Promise<CreatedFilmResponseDto> {
    //     const { actorsList, ...film } = filmDto;
    //     const actorsEntities = actorsList
    //         .split(',')
    //         .filter(a => a.trim())
    //         .map(actorName =>
    //             plainToClass(ActorEntity, {
    //                 fullName: actorName.trim(),
    //             }),
    //         );
    //
    //     return await this.connection.transaction(async manager => {
    //         try {
    //             const newFilm = await manager.save(plainToClass(FilmEntity, film));
    //
    //             const { generatedMaps: createdActors } = await manager
    //                 .createQueryBuilder()
    //                 .insert()
    //                 .into(ActorEntity)
    //                 .values(actorsEntities)
    //                 .onConflict(
    //                     `
    //                 (full_name) DO UPDATE
    //                 SET films_count = actors.films_count + 1,
    //                     created_at  = actors.created_at,
    //                     updated_at  = EXCLUDED.updated_at`,
    //                 )
    //                 .returning('*')
    //                 .execute();
    //
    //             const filmActorsEntities = createdActors.map(newActor =>
    //                 plainToClass(FilmActorEntity, {
    //                     film: newFilm.id,
    //                     actor: newActor,
    //                 }),
    //             );
    //             await manager.save(filmActorsEntities);
    //
    //             return {
    //                 id: newFilm.id,
    //                 name: newFilm.name,
    //             };
    //         } catch (e) {
    //             Logger.error('Error in film creation transaction: ' + e.message);
    //             return null;
    //         }
    //     });
    // }

    async delete(id: number) {
        return await this.filmRepository.delete(id);
    }

    async batchCreate(rawFilmsData: RawFilmDto[]): Promise<FilmsImportResDto> {
        const response = new FilmsImportResDto();

        for await (const rawFilm of rawFilmsData) {
            const filmDto = plainToClass(CreateFilmDto, rawFilm);
            const errors = await validate(filmDto);
            if (errors.length) {
                response.errors.push({ value: rawFilm, error: errors });
                continue;
            }

            const newFilm = await this.createOne(filmDto);
            if (!newFilm) {
                response.errors.push({
                    value: filmDto,
                    error: 'Film with same name and year already exists!',
                });
                continue;
            }

            response.data.push(newFilm);
        }

        return response;
    }

    public parseTxt(file: Buffer): RawFilmDto[] {
        const ROWS_SEPARATOR = '\r\n';
        const ATTR_SEPARATOR = /:\s(.+)/; // this regexp need for process values with ': ' symbols
        const FILM_PARSER_SCHEMA: RawFilm = {
            name: 'Title',
            releaseYear: 'Release Year',
            format: 'Format',
            actors: 'Stars',
        };
        const txtData: string = file.toString('utf8');
        const filmsRawItems: string[] = txtData.split(ROWS_SEPARATOR.repeat(2)).filter(i => i);

        return filmsRawItems.map(rawFilm =>
            rawFilm.split(ROWS_SEPARATOR).reduce((filmObj: RawFilmDto, filmAttr) => {
                const [parseKey, parseValue = ''] = filmAttr.split(ATTR_SEPARATOR);
                const [objKey] = Object.entries(FILM_PARSER_SCHEMA).find(([, rawKey]) => rawKey === parseKey) || [
                    parseKey,
                ];
                if (!objKey) return filmObj;
                return { ...filmObj, [objKey]: parseValue.trim() };
            }, new RawFilmDto()),
        );
    }
}
