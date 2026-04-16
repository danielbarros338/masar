import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ICache } from '../../../../common/ports/i-cache';
import { Pbkdf2Util } from '../../../../common/utils/pbkdf2.util';
import { SendEmailConfirmationUseCase } from '../../../email/application/use-cases/send-email-confirmation.use-case';
import { IUserPasswordRepository } from '../../../user/application/ports/i-user-password.repository';
import { IUserRepository } from '../../../user/application/ports/i-user.repository';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { EmailVerificationMessageDto } from '../dto/email-verification-message.dto';
import { LoginDto } from '../dto/login.dto';
import { IssueTokensService } from '../issue-tokens.service';

const EMAIL_VERIFICATION_MESSAGE =
  'Enviamos uma confirmação de cadastro para seu email com um código de ativação. Insira o código para ativar a conta e continuar';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userPasswordRepository: IUserPasswordRepository,
    private readonly pbkdf2Util: Pbkdf2Util,
    private readonly issueTokensService: IssueTokensService,
    private readonly cache: ICache,
    private readonly sendEmailConfirmation: SendEmailConfirmationUseCase,
  ) {}

  async execute(
    dto: LoginDto,
  ): Promise<AuthResponseDto | EmailVerificationMessageDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const latestPassword = await this.userPasswordRepository.findLatestByUserId(
      user.id,
    );
    if (!latestPassword)
      throw new UnauthorizedException('Credenciais inválidas');

    const isValid = await this.pbkdf2Util.verify(
      dto.password,
      latestPassword.passwordHash,
    );
    if (!isValid) throw new UnauthorizedException('Credenciais inválidas');

    if (!user.emailVerified) {
      const cacheKey = `email_confirmation:${user.email}`;
      const existingToken = await this.cache.get(cacheKey);

      if (!existingToken) {
        await this.sendEmailConfirmation.execute({ email: user.email });
      }

      return { message: EMAIL_VERIFICATION_MESSAGE };
    }

    return this.issueTokensService.issue(user.id, user.email);
  }
}
