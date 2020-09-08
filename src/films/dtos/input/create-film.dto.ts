import {
    FilmCreateInput,
    FilmFormatCreateOneWithoutFilmsInput,
    ActorCreateManyWithoutFilmsInput,
} from '@prisma/client';
import { IsIn, IsInt, IsString, Length, Matches, Max, Min, MinLength } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { EnumValues } from 'enum-values';

import { FilmFormats } from '../../../database/enums';

export class CreateFilmDto implements FilmCreateInput {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsInt()
    @Max(new Date().getFullYear()) // current year
    @Min(1896) // year of production first film
    @Transform(value => Number(value))
    releaseYear: number;

    @IsIn(EnumValues.getValues(FilmFormats))
    formatName: FilmFormats;

    @ApiProperty({ description: 'List of comma separated actors full names' })
    @Matches(/^[\D\s]+(?:,[\D\s]*)*$/, {
        message: 'Actors names list can not contain numbers!',
    })
    @MinLength(5)
    @IsString()
    actorsList: string;

    @ApiHideProperty()
    @Expose({ toClassOnly: true })
    @Transform(
        (value: unknown, dto: CreateFilmDto): FilmFormatCreateOneWithoutFilmsInput => ({
            connect: { name: FilmFormats[dto.formatName] },
        }),
        { toClassOnly: true },
    )
    format: FilmFormatCreateOneWithoutFilmsInput;

    @ApiHideProperty()
    @Expose({ toClassOnly: true })
    @Transform(
        (value: unknown, dto: CreateFilmDto): ActorCreateManyWithoutFilmsInput => ({
            connectOrCreate: dto.actorsList
                .split(',')
                .filter(a => a.trim())
                .map(actorName => ({
                    where: { fullName: actorName.trim() },
                    create: { fullName: actorName.trim() },
                })),
        }),
        { toClassOnly: true },
    )
    actors: ActorCreateManyWithoutFilmsInput;
}
