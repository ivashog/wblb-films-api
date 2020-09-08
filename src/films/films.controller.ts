import {
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    HttpCode,
    UploadedFile,
    Controller,
    UseInterceptors,
    ParseIntPipe,
    ClassSerializerInterceptor,
    ConflictException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { ImportFilmsDto } from './dtos/import-films.dto';
import { CreateFilmDto } from './dtos/input/create-film.dto';
import { CreatedFilmResponseDto } from './dtos/output/created-film-response.dto';
import { FilmResponseDto } from './dtos/output/film-response.dto';
import { FilmEntity } from '../database/entities/film.entity';
import { FilmsImportResDto } from './dtos/films-import-res.dto';
import { SearchFilmsDto } from './dtos/search-films.dto';
import { SortingDto } from './dtos/input/sorting.dto';

@Controller('films')
@ApiTags('Films routes')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    @ApiOperation({ summary: 'Get list of films ordered by name' })
    @ApiOkResponse({ type: FilmResponseDto, isArray: true })
    async getList(@Query() sort: SortingDto) {
        return await this.filmsService.getList(sort.order);
    }

    @Post()
    @ApiOperation({ summary: 'Create one film' })
    @ApiCreatedResponse({ type: CreatedFilmResponseDto })
    async addFilm(@Body() film: CreateFilmDto) {
        return this.filmsService.createOne(film);
    }

    @Get('/search')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({ summary: 'Search films by name or actor' })
    @ApiOkResponse({ type: FilmResponseDto, isArray: true })
    async search(@Query() searchDto: SearchFilmsDto): Promise<FilmEntity[]> {
        const { name, actor } = searchDto;
        if ((!name && !actor) || (name && actor)) {
            throw new BadRequestException(`One of ['name', 'actor'] query params must be specified`);
        }
        return await this.filmsService.find(searchDto);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get film detail info by id' })
    async getOneDetails(@Param('id', ParseIntPipe) id: number): Promise<FilmEntity> {
        const film = await this.filmsService.findOne(id);
        if (!film) {
            throw new NotFoundException(`Film with id ${id} is not founded!`);
        }
        return film;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete film by id' })
    async dropFilm(@Param('id', ParseIntPipe) id: number) {
        const film = await this.filmsService.findOne(id);
        if (!film) {
            throw new NotFoundException(`Film with id ${id} is not founded!`);
        }
        await this.filmsService.delete(id);
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
