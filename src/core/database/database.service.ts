import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseService.name);
  constructor(config: ConfigService) {
    super({
      datasourceUrl: config.get('DATABASE_URL') as string,
    });
  }
  onModuleInit() {
    this.logger.log('Connected to database');
  }
  onModuleDestroy() {
    this.logger.log('Disconnected from database');
  }
}
