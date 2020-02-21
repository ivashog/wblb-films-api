import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { IsValidDateOptions } from './is-valid-date.decorator';
import moment, { Moment, MomentInput } from 'moment';

@ValidatorConstraint({ async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
    public validate(date: string, args: ValidationArguments): boolean {
        const { format, allowFuture, strict, min, max } = this.getConstraintsWithDefaults(args.constraints);
        const parsedDate: Moment = moment(date, format, strict);
        const isValidFormat = parsedDate.isValid();

        if (!isValidFormat) return false;

        if (!allowFuture && !min && !max) {
            return parsedDate.toDate() <= new Date();
        } else if (min && max) {
            return min >= parsedDate.toDate() && parsedDate.toDate() <= max;
        } else {
            return min ? min >= parsedDate.toDate() : max ? parsedDate.toDate() <= max : true;
        }
    }

    public defaultMessage?(args?: ValidationArguments): string {
        const { format, allowFuture, min, max } = this.getConstraintsWithDefaults(args.constraints);

        return allowFuture
            ? `Date '${args.value}' is not valid! Date must be in formats '${format}'`
            : `Date '${args.value}' is from future or not in allowed interval: ` +
                  `from '${min ? this.formatDate(min) : 'any'}' ` +
                  `to '${max ? this.formatDate(max) : this.formatDate()}'`;
    }

    private getConstraintsWithDefaults(constraints: IsValidDateOptions[]): IsValidDateOptions {
        const { format = 'YYYY-MM-DD', strict = true, allowFuture = false, min, max } = constraints[0];
        return { format, allowFuture, strict, min, max };
    }

    private formatDate(date?: MomentInput, format?: string): string {
        return moment(date || new Date()).format(format || 'YYYY-MM-DD');
    }
}
