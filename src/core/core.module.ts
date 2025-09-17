import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    NotificationsModule,
    DatabaseModule,
    EmailModule,
    FilesModule,
  ],
})
export class CoreModule {}
