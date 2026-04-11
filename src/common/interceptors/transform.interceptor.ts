import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<{ statusCode: number }>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((resData: unknown) => {
        // Handle undefined or null
        if (resData === undefined || resData === null) {
          return {
            statusCode,
            message: 'Success',
            data: resData as T,
          };
        }

        // Check if the service already returns data and meta (e.g., from pagination)
        if (
          typeof resData === 'object' &&
          resData !== null &&
          'data' in resData &&
          'meta' in resData
        ) {
          const paginatedData = resData as { data: T; meta: Record<string, unknown> };
          return {
            statusCode,
            message: 'Success',
            data: paginatedData.data,
            meta: paginatedData.meta,
          };
        }

        // Otherwise, wrap the result directly under data
        return {
          statusCode,
          message: 'Success',
          data: resData as T,
        };
      }),
    );
  }
}
