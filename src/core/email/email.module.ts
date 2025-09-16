import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"CAAUTO" <no-reply@caauto.com>',
        },
        template: {
          dir: __dirname + '/templates/',
          adapter: new EjsAdapter(),
          // options: {
          //   strict: true,
          // },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
})
export class EmailModule {}
