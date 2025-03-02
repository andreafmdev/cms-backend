import { Module } from '@nestjs/common';
import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

const Services = [NotificationService];
@Module({
  imports: [
    Mailer.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const smtpPort = Number(configService.get('SMTP_PORT'));
        return {
          transport: {
            host: configService.get('SMTP_HOST'),
            port: smtpPort,
            secure: smtpPort === 465, // true per porta 465, false per altre porte
            auth: {
              user: configService.get('MAILER_API_KEY'),
              pass: configService.get('MAILER_SECRET_KEY'),
            },
          },
          defaults: {
            from: `"${configService.get('MAIL_FROM_NAME', 'nest-modules')}" <${configService.get('MAIL_FROM_ADDRESS', 'no-reply@example.com')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [...Services],
  exports: [...Services],
})
export class MailerModule {}
