import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FilmPlainResDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    releaseYear: number;

    @Expose()
    format: string;

    @Expose()
    actors: string[];
}
