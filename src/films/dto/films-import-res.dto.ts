import { ApiProperty } from '@nestjs/swagger';

import { CreatedFilmDto } from './created-film.dto';
import { ImportFilmErrorDto } from './import-film-error.dto';

export class FilmsImportResDto {
    @ApiProperty({ type: CreatedFilmDto, isArray: true })
    data: CreatedFilmDto[] = [];

    @ApiProperty({ type: ImportFilmErrorDto, isArray: true })
    errors: ImportFilmErrorDto[] = [];
}
