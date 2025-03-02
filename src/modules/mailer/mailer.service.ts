import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    to = 'freddi.dev@gmail.com';
    const isMailerEnabled = process.env.MAILER_ENABLED !== 'false';
    if (!isMailerEnabled) {
      console.log('Mailer is disabled');
      return;
    }
    try {
      await this.mailerService.sendMail({
        to,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `Benvenuto! ${username}`,
        template: './welcome', // Nome del file pug (senza estensione)
        context: { username, year: new Date().getFullYear() },
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(error);
    }
  }
}
