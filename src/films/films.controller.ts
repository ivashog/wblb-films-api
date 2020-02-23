import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    ConflictException,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { FilmsImportDto } from './dto/films-import.dto';
import { AddFilmDto } from './dto/add-film.dto';
import { FilmEntity } from '../database/entities/film.entity';

@Controller('films')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getList() {
        return await this.filmsService.findAll();
    }

    @Post()
    async addFilm(@Body() film: AddFilmDto): Promise<FilmEntity> {
        const newFilm = await this.filmsService.create(film);

        if (!newFilm) {
            throw new ConflictException(`Film with this parameters already exists!`);
        }

        return newFilm;
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
