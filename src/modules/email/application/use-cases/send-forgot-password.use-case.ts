import { Injectable, Logger } from '@nestjs/common';
import { ICache } from '../../../../common/ports/i-cache';
import { SendForgotPasswordDto } from '../dto/send-forgot-password.dto';
import { IEmailService } from '../ports/i-email-service';

const FORGOT_PASSWORD_TTL_SECONDS = 5 * 60;

@Injectable()
export class SendForgotPasswordUseCase {
  private readonly logger = new Logger(SendForgotPasswordUseCase.name);

  constructor(
    private readonly cache: ICache,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: SendForgotPasswordDto): Promise<void> {
    const key = `forgot_password:${dto.email}`;

    await this.cache.set(key, 'authorized', FORGOT_PASSWORD_TTL_SECONDS);
    await this.emailService.sendForgotPassword(dto.email);

    this.logger.log(`Autorização de troca de senha gerada para ${dto.email}`);
  }
}
