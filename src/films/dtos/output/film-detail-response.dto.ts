import { FilmFormat, PromiseReturnType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { FilmsService } from '../../films.service';
import { ArrayElement, PropType } from '../../../shared/types';

type FilmsDetailResponse = PromiseReturnType<FilmsService['getById']>;
type ActorResponse = ArrayElement<PropType<Pick<FilmsDetailResponse, 'actors'>, 'actors'>>;

class ActorResponseDto implements ActorResponse {
    id: number;
    fullName: string;
    filmsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export class FilmDetailResponseDto implements FilmsDetailResponse {
    id: number;
    name: string;
    releaseYear: number;
    createdAt: Date;
    actors: ActorResponseDto[];

    @ApiProperty({ type: String })
    @Transform((format: FilmFormat) => format.name)
    format: FilmFormat;
}
