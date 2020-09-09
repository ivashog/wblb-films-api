import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
    constructor(response: string | Record<string, any>, status: HttpStatus) {
        super(response, status);
    }

    static parseParamsObj = (params: object): string =>
        Object.entries(params)
            .reduce((acc, [key, value]) => [...acc, `'${key}'='${value}'`], [])
            .join(',');
}
