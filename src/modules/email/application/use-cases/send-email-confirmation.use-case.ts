import { Injectable, Logger } from '@nestjs/common';
import { ICache } from '../../../../common/ports/i-cache';
import { SendEmailConfirmationDto } from '../dto/send-email-confirmation.dto';
import { IEmailService } from '../ports/i-email-service';

const EMAIL_CONFIRMATION_TTL_SECONDS = 15 * 60;

@Injectable()
export class SendEmailConfirmationUseCase {
  private readonly logger = new Logger(SendEmailConfirmationUseCase.name);

  constructor(
    private readonly cache: ICache,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: SendEmailConfirmationDto): Promise<void> {
    const token = this.generateToken();
    const key = `email_confirmation:${dto.email}`;

    await this.cache.set(key, token, EMAIL_CONFIRMATION_TTL_SECONDS);
    await this.emailService.sendEmailConfirmation(dto.email, token);

    this.logger.log(`Token de confirmação gerado para ${dto.email}`);
  }

  private generateToken(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
