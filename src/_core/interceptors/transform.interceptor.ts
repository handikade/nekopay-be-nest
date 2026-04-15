import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { Response } from 'src/_core/types/http.type';

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

        // Check if the service returns custom message and data
        if (
          typeof resData === 'object' &&
          resData !== null &&
          'data' in resData &&
          'message' in resData
        ) {
          const customRes = resData as {
            data: T;
            message: string;
            meta?: Record<string, unknown>;
          };
          return {
            statusCode,
            message: customRes.message,
            data: customRes.data,
            meta: customRes.meta,
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
