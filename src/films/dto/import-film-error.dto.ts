import { AddFilmDto } from './add-film.dto';
import { ValidationError } from 'class-validator';
import { RawFilmDto } from './raw-film.dto';

export class ImportFilmErrorDto {
    value: AddFilmDto | RawFilmDto;
    error: ValidationError[] | string;
}
