import { Column, PrimaryColumn } from 'typeorm';

import { WithId } from '../../types';

export abstract class BaseDictEntity implements WithId {
    @PrimaryColumn({ type: 'smallint' })
    readonly id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    nameEn: string;
}
