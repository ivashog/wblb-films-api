import { BadRequestException, Logger } from '@nestjs/common';
import { BeforeInsert, BeforeUpdate } from 'typeorm';
import { validate } from 'class-validator';
import { classToClass } from 'class-transformer';

/**
 * All entities should extend this class. It has basic properties
 * and methods. There should be a specific reason to not extend this class
 * It has combined index for createdAt and id to improve pagination
 */
export abstract class AbstractEntity {
    /** Id can only be set in constructor */
    constructor(id?: any) {
        if (id) {
            this.id = id;
        }
    }

    /** abstract unique Id */
    readonly id: any;

    /** All entities will be auto validated before inserting or updating. */
    @BeforeInsert()
    @BeforeUpdate()
    async validate(): Promise<void> {
        let errors = await validate(this);
        // Exclude some private fields. Those fields are excluded when transformed.

        if (errors.length > 0) {
            errors = errors.map(({ target, ...other }) => ({
                ...other,
                target: classToClass(target),
            }));
            if (process.env.NODE_ENV !== 'production') {
                new Logger('AbstractEntity').error('Error when trying to insert:' + errors);
            }

            throw new BadRequestException(errors);
        }
    }
}
