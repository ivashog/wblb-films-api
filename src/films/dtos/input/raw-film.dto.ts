import { CreateFilmDto } from './create-film.dto';

export type RawFilm = Record<keyof Omit<CreateFilmDto, 'format' | 'actors'>, string>;

export class RawFilmDto implements RawFilm {
    name: string = null;
    releaseYear: string = null;
    formatName: string = null;
    actorsList: string = null;
}
