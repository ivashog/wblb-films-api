import { CreatedFilmDto } from './created-film.dto';
import { ImportFilmErrorDto } from './import-film-error.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class FilmsImportResDto {
    @ApiProperty({ type: CreatedFilmDto, isArray: true })
    data: CreatedFilmDto[] = [];

    @ApiProperty({ type: ImportFilmErrorDto, isArray: true })
    errors: ImportFilmErrorDto[] = [];
}
