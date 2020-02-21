import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export const exceptionFactory = (errors: ValidationError[]) => {
    // tslint:disable-next-line:no-shadowed-variable
    function formatErrors(errors) {
        return errors.map(err => {
            if (err.constraints) {
                for (const property in err.constraints) {
                    if (err.constraints.hasOwnProperty(property)) {
                        return err.constraints[property];
                    }
                }
            } else {
                return formatErrors(err.children);
            }
        });
    }

    const errorSet = new Set([]);
    formatErrors(errors).forEach(err => errorSet.add(err));

    return new HttpException(Array.from(Array.from(errorSet)), HttpStatus.BAD_REQUEST);
};
