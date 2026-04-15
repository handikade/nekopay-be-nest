import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // Many NestJS exceptions return { statusCode, message, error }
        const exRes = exceptionResponse as { message?: string; error?: string };
        message = exRes.message || message;
        error = exRes.error || error;
      }
    } else if (exception instanceof Error) {
      // It's a non-HttpException error. In production, you might not want to expose this.
      message = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: String(httpAdapter.getRequestUrl(ctx.getRequest<unknown>())),
    };

    httpAdapter.reply(ctx.getResponse<unknown>(), responseBody, httpStatus);
  }
}
