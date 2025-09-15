import { PaginationOptions, PaginationResult } from './pagination.interface';

export interface BaseRepository<T, ID = string> {
  create(data: T): Promise<T>;
  find(id: ID): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<PaginationResult<T>>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<T>;
}
