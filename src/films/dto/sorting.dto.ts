import { IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export type SortOrder = 'ASC' | 'DESC';

export class SortingDto {
    @ApiProperty()
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    @IsString()
    @Transform(value => value.toUpperCase())
    order?: SortOrder = 'ASC';
}
