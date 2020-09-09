import { IsOptional, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFilmsDto {
    @ApiProperty()
    @IsOptional()
    @MinLength(3)
    name?: string;

    @ApiProperty()
    @IsOptional()
    @MinLength(3)
    actor?: string;
}
