import type { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    error?: string
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response<ApiResponse<T>> {
    return this.success(res, data, message, 201);
  }

  static updated<T>(
    res: Response,
    data: T,
    message: string = 'Resource updated successfully'
  ): Response<ApiResponse<T>> {
    return this.success(res, data, message, 200);
  }

  static deleted(
    res: Response,
    message: string = 'Resource deleted successfully'
  ): Response<ApiResponse> {
    return this.success(res, null, message, 200);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response<ApiResponse> {
    return this.error(res, message, 404);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 400, error);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response<ApiResponse> {
    return this.error(res, message, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ): Response<ApiResponse> {
    return this.error(res, message, 403);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 409, error);
  }

  static internalServerError(
    res: Response,
    message: string = 'Internal server error',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 500, error);
  }
}
