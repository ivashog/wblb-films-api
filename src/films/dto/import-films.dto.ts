import { ApiProperty } from '@nestjs/swagger';

export class ImportFilmsDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
