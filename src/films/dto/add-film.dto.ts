import { IsIn, IsInt, IsNotEmpty, IsString, Length, Max, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { FilmFormats } from '../../database/enums';
import { EnumValues } from 'enum-values';

export class AddFilmDto {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsInt()
    @Max(new Date().getFullYear()) // current year
    @Min(1896) // year of production first film
    @Transform(value => Number(value))
    releaseYear: number;

    @IsIn(EnumValues.getNames(FilmFormats))
    format: FilmFormats;

    @MinLength(5)
    @IsString()
    actors: string;
}
