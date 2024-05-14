import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Config } from 'src/common/config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(Config.MAIL_HOST),
          secure: false,
          port: config.get(Config.MAIL_PORT),
          auth: {
            user: config.get(Config.MAIL_USER),
            pass: config.get(Config.MAIL_PASS),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
