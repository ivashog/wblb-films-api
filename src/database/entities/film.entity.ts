import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { FormatDictEntity } from './format-dict.entity';
import { FilmActorEntity } from './film-actor.entity';

@Entity('films')
export class FilmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    readonly id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'smallint' })
    releaseYear: number;

    @ManyToOne(type => FormatDictEntity)
    format: FormatDictEntity;

    @OneToMany(
        type => FilmActorEntity,
        actor => actor.film,
    )
    actors: FilmActorEntity[];
}
