import { IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '@prisma/client';

export class SortingDto {
    @ApiProperty()
    @IsOptional()
    @IsIn(Object.values(SortOrder))
    @IsString()
    @Transform((value: string) => value.toLowerCase())
    order?: SortOrder = SortOrder.asc;
}
