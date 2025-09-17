import { PaginationResult } from 'src/common/interface';
import {
  Listings,
  ListingsCreateInput,
  ListingsUpdateInput,
} from '../listings.schema';

import { CarListingParams } from './params.interface';

export interface ListingsRepositoryInterface {
  create(data: ListingsCreateInput): Promise<Listings>;
  find(id: string): Promise<Listings | null>;
  findAll(options?: CarListingParams): Promise<PaginationResult<Listings>>;
  update(id: string, data: Partial<ListingsUpdateInput>): Promise<Listings>;
  delete(id: string): Promise<Listings>;
}
