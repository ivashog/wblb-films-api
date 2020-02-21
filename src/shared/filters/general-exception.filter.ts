import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GeneralExceptionFilter<T> implements ExceptionFilter {
    private readonly logger = new Logger(GeneralExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            path: request.url,
            method: request.method,
            timestamp: new Date().toLocaleString(),
            errors: this.getErrorFromException(exception),
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${request.method} ${request.url} ${exception.message}`, exception.stack);
        } else {
            this.logger.error(`${request.method} ${request.url} - ${errorResponse.errors}`);
        }
        response.status(status).json(errorResponse);
    }

    private getErrorFromException(exception: HttpException): string {
        if (!(exception instanceof HttpException)) {
            return 'Internal server error';
        }
        return exception.message.message || exception.message || exception.getResponse() || null;
    }
}
