import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendWelcomeEmail(email: string, customerName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to CAAUTO',
      template: 'welcome.template.ejs',
      context: {
        customerName,
        email,
      },
    });
  }

  async sendOtpEmail(
    email: string,
    customerName: string,
    otp: string,
    description: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP for CAAUTO',
      template: 'otp.template.ejs',
      context: {
        customerName,
        email,
        otp,
        description,
      },
    });
  }
}
