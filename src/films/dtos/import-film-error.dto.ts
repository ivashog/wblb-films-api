import { RawFilmDto } from './raw-film.dto';

export class ImportFilmErrorDto {
    value: RawFilmDto;
    error: string[];
}
