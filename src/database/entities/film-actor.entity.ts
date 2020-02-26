import { Entity, ManyToOne } from 'typeorm';

import { FilmEntity } from './film.entity';
import { ActorEntity } from './actor.entity';

@Entity('film_actors')
export class FilmActorEntity {
    @ManyToOne(
        type => FilmEntity,
        film => film.actors,
        { primary: true, onDelete: 'CASCADE' },
    )
    film: FilmEntity;

    @ManyToOne(
        type => ActorEntity,
        actor => actor.films,
        { primary: true, eager: true },
    )
    actor: ActorEntity;
}
