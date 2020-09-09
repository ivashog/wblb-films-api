import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
    constructor(response: string | Record<string, any>, status: HttpStatus) {
        super(response, status);
    }

    static parseWhereParams = (paramsObj: object): string =>
        Object.entries(paramsObj)
            .reduce((acc, [key, value]) => [...acc, `${key}=${value}`], [])
            .join(',');
}
