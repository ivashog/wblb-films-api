import { ApiProperty } from '@nestjs/swagger';

export class FilmsImportDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
