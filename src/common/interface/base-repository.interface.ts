import { PaginationOptions, PaginationResult } from './pagination.interface';

export interface BaseRepository<T, CI, UI, ID = string> {
  create(data: CI): Promise<T>;
  find(id: ID): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<PaginationResult<T>>;
  update(id: ID, data: UI): Promise<T>;
  delete(id: ID): Promise<T>;
}
