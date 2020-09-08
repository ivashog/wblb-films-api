import { ApiProperty } from '@nestjs/swagger';

import { CreatedFilmResponseDto } from './output/created-film-response.dto';
import { ImportFilmErrorDto } from './import-film-error.dto';

export class FilmsImportResDto {
    @ApiProperty({ type: CreatedFilmResponseDto, isArray: true })
    data: CreatedFilmResponseDto[] = [];

    @ApiProperty({ type: ImportFilmErrorDto, isArray: true })
    errors: ImportFilmErrorDto[] = [];
}
