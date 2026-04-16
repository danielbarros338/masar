import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITransactionManager } from '../../../../common/ports/i-transaction-manager';
import { Pbkdf2Util } from '../../../../common/utils/pbkdf2.util';
import { SendEmailConfirmationUseCase } from '../../../email/application/use-cases/send-email-confirmation.use-case';
import { IUserPasswordRepository } from '../../../user/application/ports/i-user-password.repository';
import { IUserRepository } from '../../../user/application/ports/i-user.repository';
import { UserPasswordEntity } from '../../../user/domain/entities/user-password.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { EmailVerificationMessageDto } from '../dto/email-verification-message.dto';
import { RegisterDto } from '../dto/register.dto';

const EMAIL_VERIFICATION_MESSAGE =
  'Enviamos uma confirmação de cadastro para seu email com um código de ativação. Insira o código para ativar a conta e continuar';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userPasswordRepository: IUserPasswordRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly pbkdf2Util: Pbkdf2Util,
    private readonly sendEmailConfirmation: SendEmailConfirmationUseCase,
  ) {}

  async execute(dto: RegisterDto): Promise<EmailVerificationMessageDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const passwordHash = await this.pbkdf2Util.hash(dto.password);
    const userId = randomUUID();
    const now = new Date();

    const user = new UserEntity({
      id: userId,
      firstname: dto.firstname,
      surname: dto.surname,
      email: dto.email,
      birthdate: dto.birthdate,
      active: false,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    const password = new UserPasswordEntity({
      id: randomUUID(),
      userId,
      passwordHash,
      createdAt: now,
    });

    await this.transactionManager.run(async (manager) => {
      await this.userRepository.saveWithManager(user, manager);
      await this.userPasswordRepository.saveWithManager(password, manager);
    });

    await this.sendEmailConfirmation.execute({ email: dto.email });

    return { message: EMAIL_VERIFICATION_MESSAGE };
  }
}
