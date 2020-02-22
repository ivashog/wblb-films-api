import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('formats_dict')
export class FormatDictEntity {
    @PrimaryGeneratedColumn('increment', { type: 'smallint' })
    readonly id: number;

    @Column('varchar')
    name: string;

    @Column('varchar', { nullable: true })
    description: string;
}
