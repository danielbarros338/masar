import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ICache } from '../../../../common/ports/i-cache';
import { IUserRepository } from '../../../user/application/ports/i-user.repository';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ConfirmEmailDto } from '../dto/confirm-email.dto';
import { IssueTokensService } from '../issue-tokens.service';

@Injectable()
export class ConfirmEmailUseCase {
  private readonly logger = new Logger(ConfirmEmailUseCase.name);

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cache: ICache,
    private readonly issueTokensService: IssueTokensService,
  ) {}

  async execute(dto: ConfirmEmailDto): Promise<AuthResponseDto> {
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

    return this.issueTokensService.issue(user.id, user.email);
  }
}
