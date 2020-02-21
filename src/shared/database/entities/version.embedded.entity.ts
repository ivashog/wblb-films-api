import { CreateDateColumn, Index, UpdateDateColumn, VersionColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export class VersionEmbeddedEntity {
    /**
     * Date when entity was created.
     * It has index for cursor pagination
     */
    @CreateDateColumn({ precision: 3 })
    @Index()
    readonly createdAt: Date;

    /**
     * Date when entity was last updated.
     * 3 point precision, keep track of miliseconds.
     */
    @UpdateDateColumn({ precision: 3 })
    @Exclude()
    updatedAt: Date;

    /** Updated count */
    @VersionColumn()
    version: number;
}
