import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { FilmActorEntity } from './film-actor.entity';

@Entity('actors')
export class ActorEntity {
    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    readonly id: number;

    @Column()
    fullName: string;

    @OneToMany(
        type => FilmActorEntity,
        film => film.film,
    )
    films: FilmActorEntity;
}
