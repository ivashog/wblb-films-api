import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { FilmActorEntity } from './film-actor.entity';
import { Exclude } from 'class-transformer';

@Entity('actors')
export class ActorEntity {
    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    readonly id: number;

    @Index({ unique: true })
    @Column()
    fullName: string;

    @Column({ type: 'integer', default: 1 })
    filmsCount: number;

    @Exclude()
    @CreateDateColumn({ precision: 0 })
    readonly createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ precision: 0 })
    updatedAt: Date;

    @OneToMany(type => FilmActorEntity, films => films.film)
    films: FilmActorEntity[];
}
