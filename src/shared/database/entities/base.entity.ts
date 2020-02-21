import { AbstractEntity } from './abstract.entity';
import { WithId } from '../../types';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity extends AbstractEntity implements WithId {
    @PrimaryGeneratedColumn('increment', { type: 'integer' })
    readonly id: number;
}
