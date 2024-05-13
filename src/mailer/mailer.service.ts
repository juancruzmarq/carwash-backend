import {
  ISendMailOptions,
  MailerService as MailService,
} from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailerService {
  private logger = new Logger(MailerService.name);

  constructor(private readonly mailerService: MailService) {}

  /**
   * Function to send an email
   * @param ISendMailOptions
   * @returns boolean
   */
  async send(options: ISendMailOptions): Promise<boolean | HttpException> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: {
          url: options.context.url,
        },
      });
      this.logger.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error('Error al enviar el correo', error);
      throw new HttpException(
        'Error al enviar el correo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
