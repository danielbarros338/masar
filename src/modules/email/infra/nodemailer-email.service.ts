import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IEmailService } from '../application/ports/i-email-service';
import { emailConfirmationTemplate } from './templates/email-confirmation.template';
import { forgotPasswordTemplate } from './templates/forgot-password.template';

@Injectable()
export class NodemailerEmailService extends IEmailService {
  private readonly logger = new Logger(NodemailerEmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmailConfirmation(to: string, token: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Confirme seu e-mail',
      html: emailConfirmationTemplate(token),
    });

    this.logger.log(`E-mail de confirmação enviado para ${to}`);
  }

  async sendForgotPassword(to: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Redefinição de senha',
      html: forgotPasswordTemplate(),
    });

    this.logger.log(`E-mail de recuperação de senha enviado para ${to}`);
  }
}
