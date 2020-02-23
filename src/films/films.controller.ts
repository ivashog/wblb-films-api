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
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { ImportFilmsDto } from './dto/import-films.dto';
import { AddFilmDto } from './dto/add-film.dto';
import { CreatedFilmDto } from './dto/created-film.dto';
import { FilmPlainResDto } from './dto/film-plain-res.dto';
import { FilmEntity } from '../database/entities/film.entity';

@Controller('films')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Films routes')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    @ApiOkResponse({ type: FilmPlainResDto, isArray: true })
    async getList(): Promise<FilmEntity[]> {
        return await this.filmsService.findAll();
    }

    @Post()
    async addFilm(@Body() film: AddFilmDto): Promise<CreatedFilmDto> {
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
        type: ImportFilmsDto,
    })
    async import(@UploadedFile() file: Express.Multer.File) {
        return await this.filmsService.importFromFile(file.buffer);
    }
}
