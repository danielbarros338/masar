import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { IEmailService } from './application/ports/i-email-service';
import { SendEmailConfirmationUseCase } from './application/use-cases/send-email-confirmation.use-case';
import { SendForgotPasswordUseCase } from './application/use-cases/send-forgot-password.use-case';
import { NodemailerEmailService } from './infra/nodemailer-email.service';

@Module({
  imports: [CommonModule],
  providers: [
    SendEmailConfirmationUseCase,
    SendForgotPasswordUseCase,
    { provide: IEmailService, useClass: NodemailerEmailService },
  ],
  exports: [SendEmailConfirmationUseCase, SendForgotPasswordUseCase],
})
export class EmailModule {}
