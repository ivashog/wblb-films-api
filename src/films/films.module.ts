import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmEntity } from '../database/entities/film.entity';
import { FilmActorEntity } from '../database/entities/film-actor.entity';
import { ActorEntity } from '../database/entities/actor.entity';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [TypeOrmModule.forFeature([FilmEntity, FilmActorEntity, ActorEntity]), PrismaModule],
    controllers: [FilmsController],
    providers: [FilmsService],
})
export class FilmsModule {}
