import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ICache } from '../../../../common/ports/i-cache';
import { ConfirmEmailDto } from '../dto/confirm-email.dto';
import { IUserRepository } from '../ports/i-user.repository';

@Injectable()
export class ConfirmEmailUseCase {
  private readonly logger = new Logger(ConfirmEmailUseCase.name);

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cache: ICache,
  ) {}

  async execute(dto: ConfirmEmailDto): Promise<void> {
    const key = `email_confirmation:${dto.email}`;
    const storedToken = await this.cache.get(key);

    if (!storedToken || storedToken !== dto.token) {
      throw new UnprocessableEntityException('Token inválido ou expirado');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    user.confirmEmail();
    await this.userRepository.save(user);
    await this.cache.del(key);

    this.logger.log(`E-mail confirmado com sucesso: ${dto.email}`);
  }
}
