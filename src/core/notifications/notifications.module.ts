import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { UserRepository } from '../users/user.repository';

@Global()
@Module({
  providers: [NotificationsService, NotificationsRepository, UserRepository],
  controllers: [NotificationsController],
  exports: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule {}
