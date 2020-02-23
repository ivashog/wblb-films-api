import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { FilmEntity } from '../database/entities/film.entity';
import { RawFilm, RawFilmDto } from './dto/raw-film.dto';
import { AddFilmDto } from './dto/add-film.dto';
import { ActorEntity } from '../database/entities/actor.entity';
import { plainToClass } from 'class-transformer';
import { FilmActorEntity } from '../database/entities/film-actor.entity';

@Injectable()
export class FilmsService {
    constructor(
        private readonly connection: Connection,
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>,
        @InjectRepository(ActorEntity)
        private readonly actorRepository: Repository<ActorEntity>,
    ) {}

    async findAll() {
        return await this.filmRepository.find({
            order: { name: 'ASC' },
        });
    }

    async create(filmDto: AddFilmDto) {
        const { actors, ...film } = filmDto;
        const actorsEntities = actors.split(',').map(actorName =>
            plainToClass(ActorEntity, {
                fullName: actorName.trim(),
            }),
        );

        return await this.connection.transaction(async manager => {
            try {
                const newFilm = await manager.save(plainToClass(FilmEntity, film));

                const { identifiers: createdActors } = await manager
                    .createQueryBuilder()
                    .insert()
                    .into(ActorEntity)
                    .values(actorsEntities)
                    .onConflict(
                        `
                    (full_name) DO UPDATE
                    SET films_count = EXCLUDED.films_count + 1`,
                    )
                    .execute();

                const filmActorsEntities = createdActors.map(newActor =>
                    plainToClass(FilmActorEntity, {
                        film: newFilm.id,
                        actor: newActor.id,
                    }),
                );
                await manager.save(filmActorsEntities);

                return newFilm;
            } catch (e) {
                Logger.error('Error in film creation transaction: ' + e.message);
                return null;
            }
        });
    }

    async importFromFile(file: Buffer) {
        const filmsData = this.parseTxt(file);

        return filmsData;
    }

    private async upsertActors(actors: ActorEntity[]): Promise<number[]> {
        const { identifiers } = await this.actorRepository
            .createQueryBuilder()
            .insert()
            .values(actors)
            .onConflict(
                `(full_name) DO UPDATE
                SET films_count = EXCLUDED.films_count + 1`,
            )
            .execute();

        return identifiers.map(i => i.id);
    }

    private parseTxt(file: Buffer): RawFilmDto[] {
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
                const [parseKey, parseValue] = filmAttr.split(ATTR_SEPARATOR);
                const [objKey] = Object.entries(FILM_PARSER_SCHEMA).find(([, rawKey]) => rawKey === parseKey);
                return { ...filmObj, [objKey]: parseValue.trim() };
            }, new RawFilmDto()),
        );
    }
}
