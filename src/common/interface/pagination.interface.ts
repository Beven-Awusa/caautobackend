export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
