import { IsIn, IsInt, IsString, Length, Matches, Max, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumValues } from 'enum-values';

import { FilmFormats } from '../../database/enums';

export class AddFilmDto {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsInt()
    @Max(new Date().getFullYear()) // current year
    @Min(1896) // year of production first film
    @Transform(value => Number(value))
    releaseYear: number;

    @IsIn(EnumValues.getValues(FilmFormats))
    @Transform(format => FilmFormats[format])
    format: FilmFormats;

    @Matches(/^[\D\s]+(?:,[\D\s]*)*$/, {
        message: 'Actors names list can not contain numbers!',
    })
    @MinLength(5)
    @IsString()
    actors: string;
}
