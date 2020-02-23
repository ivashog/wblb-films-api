import { FilmEntity } from '../../database/entities/film.entity';

export type RawFilm = { [P in keyof FilmEntity]?: string };

export class RawFilmDto implements RawFilm {
    name: string = null;
    releaseYear: string = null;
    format: string = null;
    actors: string = null;
}
