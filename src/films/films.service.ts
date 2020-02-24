import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository } from 'typeorm';
import { plainToClass, TransformClassToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { FilmEntity } from '../database/entities/film.entity';
import { RawFilm, RawFilmDto } from './dto/raw-film.dto';
import { AddFilmDto } from './dto/add-film.dto';
import { ActorEntity } from '../database/entities/actor.entity';
import { FilmActorEntity } from '../database/entities/film-actor.entity';
import { CreatedFilmDto } from './dto/created-film.dto';
import { FilmsImportResDto } from './dto/films-import-res.dto';
import { SearchFilmsDto } from './dto/search-films.dto';

@Injectable()
export class FilmsService {
    constructor(
        private readonly connection: Connection,
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>,
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
    ) {}

    async findAll(): Promise<FilmEntity[]> {
        return await this.filmRepository.find({
            order: { name: 'ASC' },
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

    async create(filmDto: AddFilmDto): Promise<CreatedFilmDto> {
        const { actors, ...film } = filmDto;
        const actorsEntities = actors.split(',').map(actorName =>
            plainToClass(ActorEntity, {
                fullName: actorName.trim(),
            }),
        );

        return await this.connection.transaction(async manager => {
            try {
                const newFilm = await manager.save(plainToClass(FilmEntity, film));

                const { generatedMaps: createdActors } = await manager
                    .createQueryBuilder()
                    .insert()
                    .into(ActorEntity)
                    .values(actorsEntities)
                    .onConflict(
                        `
                    (full_name) DO UPDATE
                    SET films_count = actors.films_count + 1,
                        created_at  = actors.created_at,
                        updated_at  = EXCLUDED.updated_at`,
                    )
                    .returning('*')
                    .execute();

                const filmActorsEntities = createdActors.map(newActor =>
                    plainToClass(FilmActorEntity, {
                        film: newFilm.id,
                        actor: newActor,
                    }),
                );
                await manager.save(filmActorsEntities);

                return {
                    id: newFilm.id,
                    name: newFilm.name,
                };
            } catch (e) {
                Logger.error('Error in film creation transaction: ' + e.message);
                return null;
            }
        });
    }

    async delete(id: number) {
        return await this.filmRepository.delete(id);
    }

    async batchCreate(rawFilmsData: RawFilmDto[]): Promise<FilmsImportResDto> {
        const response = new FilmsImportResDto();

        for await (const rawFilm of rawFilmsData) {
            const filmDto = plainToClass(AddFilmDto, rawFilm);
            const errors = await validate(filmDto);
            if (errors.length) {
                response.errors.push({ value: rawFilm, error: errors });
                continue;
            }

            const newFilm = await this.create(filmDto);
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
