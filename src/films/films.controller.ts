import {
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
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { ImportFilmsDto } from './dto/import-films.dto';
import { AddFilmDto } from './dto/add-film.dto';
import { CreatedFilmDto } from './dto/created-film.dto';
import { FilmPlainResDto } from './dto/film-plain-res.dto';
import { FilmEntity } from '../database/entities/film.entity';
import { FilmsImportResDto } from './dto/films-import-res.dto';

@Controller('films')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Films routes')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    @ApiOperation({ summary: 'Get list of films ordered by name' })
    @ApiOkResponse({ type: FilmPlainResDto, isArray: true })
    async getList(): Promise<FilmEntity[]> {
        return await this.filmsService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Create one film' })
    async addFilm(@Body() film: AddFilmDto): Promise<CreatedFilmDto> {
        const newFilm = await this.filmsService.create(film);
        if (!newFilm) {
            throw new ConflictException(`Film with same name and year already exists!`);
        }
        return newFilm;
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }))
    @ApiOperation({ summary: 'Import films from *.txt file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of films in txt format',
        type: ImportFilmsDto,
    })
    async import(@UploadedFile() file: Express.Multer.File): Promise<FilmsImportResDto> {
        const rawFilmData = this.filmsService.parseTxt(file.buffer);
        return await this.filmsService.batchCreate(rawFilmData);
    }
}
