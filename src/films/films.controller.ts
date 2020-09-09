import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConflictResponse,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { FilmsService } from './films.service';
import { ImportFilmsDto } from './dtos/input/import-films.dto';
import { CreateFilmDto } from './dtos/input/create-film.dto';
import { CreatedFilmResponseDto } from './dtos/output/created-film-response.dto';
import { FilmResponseDto } from './dtos/output/film-response.dto';
import { FilmsImportResDto } from './dtos/films-import-res.dto';
import { SearchFilmsDto } from './dtos/input/search-films.dto';
import { SortingDto } from './dtos/input/sorting.dto';
import { FilmDetailResponseDto } from './dtos/output/film-detail-response.dto';

@Controller('films')
@ApiTags('Films routes')
export class FilmsController {
    constructor(private readonly filmsService: FilmsService) {}

    @Get()
    @ApiOperation({ summary: 'Get list of films ordered by name' })
    @ApiOkResponse({ type: FilmResponseDto, isArray: true })
    getList(@Query() sort: SortingDto) {
        return this.filmsService.getList(sort.order);
    }

    @Post()
    @ApiOperation({ summary: 'Create one film' })
    @ApiCreatedResponse({ type: CreatedFilmResponseDto })
    @ApiConflictResponse()
    addFilm(@Body() film: CreateFilmDto) {
        return this.filmsService.createOne(film);
    }

    @Get('/search')
    @ApiOperation({ summary: 'Search films by name or actor' })
    @ApiOkResponse({ type: FilmResponseDto, isArray: true })
    search(@Query() searchDto: SearchFilmsDto) {
        return this.filmsService.search(searchDto);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get film detail info by id' })
    @ApiOkResponse({ type: FilmDetailResponseDto })
    getOneDetails(@Param('id', ParseIntPipe) id: number) {
        return this.filmsService.getById(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete film by id' })
    dropFilm(@Param('id', ParseIntPipe) id: number) {
        return this.filmsService.delete(id);
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } }))
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Import films from *.txt file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of films in txt format',
        type: ImportFilmsDto,
    })
    async import(@UploadedFile() file: Express.Multer.File) {
        const rawFilmData = this.filmsService.parseTxt(file.buffer);
        return await this.filmsService.batchCreate(rawFilmData);
    }
}
