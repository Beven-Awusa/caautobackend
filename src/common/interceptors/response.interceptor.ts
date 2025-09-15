/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface ResponseShape<T> {
  statusCode: number;
  status: string;
  data?: T;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseShape<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseShape<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: Response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return {
          statusCode: statusCode,
          status: 'success',
          data,
          message: 'Request was successful',
        };
      }),
      catchError((error) => {
        const response: Response = context.switchToHttp().getResponse();

        let statusCode: number;
        let message: string;

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const errorResponse = error.getResponse();

          // Handle different types of error responses
          if (typeof errorResponse === 'string') {
            message = errorResponse;
          } else if (
            typeof errorResponse === 'object' &&
            errorResponse !== null
          ) {
            // For validation errors or custom error objects
            message = (errorResponse as any).message || error.message;
          } else {
            message = error.message;
          }
        } else {
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Internal Server Error';
        }

        // Set the response status code
        response.status(statusCode);

        // Create the error response format
        const errorResponse: ResponseShape<null> = {
          statusCode: statusCode,
          status: 'error',
          message: message,
          data: null,
        };

        // Don't throw the error, return the formatted response
        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
