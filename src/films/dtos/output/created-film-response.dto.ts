import { PromiseReturnType, Actor } from '@prisma/client';
import { FilmsService } from '../../films.service';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

type CreatedFilmResponse = PromiseReturnType<FilmsService['createOne']>;

export class CreatedFilmResponseDto implements CreatedFilmResponse {
    id: number;
    name: string;

    @ApiProperty({ type: String, isArray: true })
    @Transform((actors: Actor[]) => actors.map(actor => actor.fullName))
    actors: Actor[];
}
