import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { FilmsImportDto } from './dto/films-import.dto';

@Controller('films')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    async getAll() {
        return await this.filmsService.findAll();
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of films in txt format',
        type: FilmsImportDto,
    })
    async import(@UploadedFile() file: Express.Multer.File) {
        return await this.filmsService.importFromFile(file.buffer);
    }
}
