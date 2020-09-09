import { RawFilmDto } from '../input/raw-film.dto';

export class ImportFilmErrorDto {
    value: RawFilmDto;
    error: string[];
}
