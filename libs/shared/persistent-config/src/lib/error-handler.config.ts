import {
    Catch,
    Module,
    DynamicModule,
    ExceptionFilter,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { environment } from "@app/shared/environments";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            code: status,
            path: request.url,
            timestamp: Date.now(),
            message: exception.message,
            stack: environment.NODE_ENV === 'development'
                ? exception.stack
                : null
        });
    }
};

@Module({})
export class ErrorHandlerProvider {
    static register(): DynamicModule {
        return {
            module: ErrorHandlerProvider,
            exports: [ErrorHandlerProvider],
            providers: [
                {
                    provide: APP_FILTER,
                    useClass: HttpExceptionFilter,

                }
            ]
        };
    }
};
