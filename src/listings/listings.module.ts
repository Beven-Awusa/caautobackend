import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { ListingsRepository } from './listings.repository';
import { UsersModule } from 'src/core/users/users.module';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, ListingsRepository],
  imports: [UsersModule],
})
export class ListingsModule {}
