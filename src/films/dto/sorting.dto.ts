import { IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export type SortOrder = 'ASC' | 'DESC';

export class SortingDto {
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    @IsString()
    @Transform(value => value.toUpperCase())
    order?: SortOrder = 'ASC';
}
