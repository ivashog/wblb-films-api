import { Actor, FilmFormat, PromiseReturnType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { ArrayElement } from '../../shared/types';
import { FilmsService } from '../films.service';

type FilmsListResponse = PromiseReturnType<FilmsService['getList']>;
type FilmResponse = ArrayElement<FilmsListResponse>;

export class FilmResponseDto implements FilmResponse {
    id: number;
    name: string;
    releaseYear: number;

    @ApiProperty({ type: String })
    @Transform((format: FilmFormat) => format.name)
    format: FilmFormat;

    @ApiProperty({ type: String, isArray: true })
    @Transform((actors: Actor[]) => actors.map(actor => actor.fullName))
    actors: Actor[];
}
