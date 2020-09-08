import { CreateFilmDto } from './input/create-film.dto';
import { ValidationError } from 'class-validator';
import { RawFilmDto } from './raw-film.dto';

export class ImportFilmErrorDto {
    value: CreateFilmDto | RawFilmDto;
    error: ValidationError[] | string;
}
