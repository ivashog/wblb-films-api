import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntity } from '../database/entities/film.entity';
import { RawFilm, RawFilmDto } from './dto/raw-film.dto';

@Injectable()
export class FilmsService {
    constructor(
        @InjectRepository(FilmEntity)
        private readonly filmRepository: Repository<FilmEntity>,
    ) {}

    async findAll() {
        return await this.filmRepository.find({
            order: { name: 'ASC' },
        });
    }

    async importFromFile(file: Buffer) {
        const filmsData = this.parseTxt(file);

        return filmsData;
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
