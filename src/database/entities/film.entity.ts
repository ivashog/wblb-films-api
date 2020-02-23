import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { FormatDictEntity } from './format-dict.entity';
import { FilmActorEntity } from './film-actor.entity';
import { Exclude, Transform } from 'class-transformer';
import { FilmFormats } from '../enums';

@Unique(['name', 'releaseYear'])
@Entity('films')
export class FilmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    readonly id: number;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'smallint' })
    releaseYear: number;

    @Transform(format => format.name, { toPlainOnly: true })
    @Transform(format => FilmFormats[format], { toClassOnly: true })
    @ManyToOne(type => FormatDictEntity, { eager: true })
    format: FormatDictEntity;

    @Transform(actors => actors.map(item => item.actor.fullName), { toPlainOnly: true })
    @OneToMany(
        type => FilmActorEntity,
        actor => actor.film,
        { eager: true },
    )
    actors: FilmActorEntity[];

    @Exclude()
    @CreateDateColumn({ precision: 0 })
    readonly createdAt: Date;
}
