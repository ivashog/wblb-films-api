import { registerDecorator, ValidationOptions } from 'class-validator';
import { MomentFormatSpecification } from 'moment';
import { IsValidDateConstraint } from './is-valid-date.constraint';

export interface IsValidDateOptions {
    format?: MomentFormatSpecification;
    strict?: boolean;
    allowFuture?: boolean;
    min?: Date;
    max?: Date;
}

export function IsValidDate(options: IsValidDateOptions, validationOptions?: ValidationOptions) {
    return (object: object, propName: string) => {
        registerDecorator({
            name: 'IsValidDate',
            target: object.constructor,
            propertyName: propName,
            options: validationOptions,
            constraints: [options],
            validator: IsValidDateConstraint,
        });
    };
}
