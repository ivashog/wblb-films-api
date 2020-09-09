import { ApiProperty } from '@nestjs/swagger';

import { CreatedFilmResponseDto } from './created-film-response.dto';
import { ImportFilmErrorDto } from './import-film-error.dto';

export class FilmsImportResponseDto {
    @ApiProperty({ type: CreatedFilmResponseDto, isArray: true })
    data: CreatedFilmResponseDto[] = [];

    @ApiProperty({ type: ImportFilmErrorDto, isArray: true })
    errors: ImportFilmErrorDto[] = [];
}
