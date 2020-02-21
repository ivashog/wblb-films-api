import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype, type } = metadata;

        if (value instanceof Object && ValidationPipe.isEmpty(value) && type !== 'query') {
            throw new HttpException(`Validation error: object is empty`, HttpStatus.BAD_REQUEST);
        }

        if (!metatype || !ValidationPipe.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            const set = new Set([]);
            this.formatErrors(errors)
                .split(';')
                .forEach(err => set.add(err));
            throw new HttpException(Array.from(set), HttpStatus.BAD_REQUEST);
        }

        return value;
    }

    private static toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private formatErrors(errors: any) {
        return errors
            .map(err => {
                if (err.constraints) {
                    for (const property in err.constraints) {
                        if (err.constraints.hasOwnProperty(property)) {
                            return err.constraints[property];
                        }
                    }
                } else {
                    return this.formatErrors(err.children);
                }
            })
            .join(';');
    }

    private static isEmpty(obj: object) {
        return !Object.keys(obj).length;
    }
}
