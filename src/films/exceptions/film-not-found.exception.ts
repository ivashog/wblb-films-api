import { HttpStatus } from '@nestjs/common';
import { FilmWhereUniqueInput } from '@prisma/client';

import { BaseException } from '../../shared/exceptions/base.exception';

export class FilmNotFoundException extends BaseException {
    constructor(whereExpression: FilmWhereUniqueInput) {
        const paramsStr = BaseException.parseParamsObj(whereExpression);
        const statusCode = HttpStatus.NOT_FOUND;

        super(
            {
                statusCode,
                message: `Film with params: ${paramsStr}; is not founded!`,
                error: 'Not Found',
            },
            statusCode,
        );
    }
}
