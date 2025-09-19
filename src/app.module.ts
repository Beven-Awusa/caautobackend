import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { ListingsModule } from './listings/listings.module';
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
    ListingsModule,
    FiltersModule,
  ],
})
export class AppModule {}
