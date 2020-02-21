import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('films')
export class FilmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    readonly id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'smallint' })
    year: number;

    @Column()
    format: string;

    @Column()
    actors: string;
}
