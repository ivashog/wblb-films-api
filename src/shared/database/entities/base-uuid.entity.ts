import { Column, PrimaryGeneratedColumn } from 'typeorm';

import { UUID, WithUuid } from '../../types';
import { VersionEmbeddedEntity } from './version.embedded.entity';
import { AbstractEntity } from './abstract.entity';

// @Index(['createdAt', 'id'])
export abstract class BaseUuidEntity extends AbstractEntity implements WithUuid {
    @PrimaryGeneratedColumn('uuid')
    readonly id: UUID;

    /**
     * Add basic version tracing columns as embedded entity.
     * @see https://github.com/typeorm/typeorm/blob/master/docs/embedded-entities.md
     */
    @Column(type => VersionEmbeddedEntity, { prefix: false })
    version: VersionEmbeddedEntity;
}
