import { HttpStatus } from '@nestjs/common';
import { NameReleaseYearCompoundUniqueInput } from '@prisma/client';

import { BaseException } from '../../shared/exceptions/base.exception';

export class CreateFilmConflictException extends BaseException {
    constructor(constraintTarget: NameReleaseYearCompoundUniqueInput) {
        const paramsStr = BaseException.parseParamsObj(constraintTarget);
        const statusCode = HttpStatus.CONFLICT;

        super(
            {
                statusCode,
                message: `Film with params: ${paramsStr}; already exists!`,
                error: 'Conflict',
            },
            statusCode,
        );
    }
}
