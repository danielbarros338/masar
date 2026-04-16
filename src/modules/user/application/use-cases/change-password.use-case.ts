import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Pbkdf2Util } from '../../../../common/utils/pbkdf2.util';
import { UserPasswordEntity } from '../../domain/entities/user-password.entity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { IUserPasswordRepository } from '../ports/i-user-password.repository';
import { IUserRepository } from '../ports/i-user.repository';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userPasswordRepository: IUserPasswordRepository,
    private readonly pbkdf2Util: Pbkdf2Util,
  ) {}

  async execute(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new NotFoundException(`Usuário com id "${userId}" não encontrado`);

    const latestPassword =
      await this.userPasswordRepository.findLatestByUserId(userId);
    if (!latestPassword)
      throw new UnauthorizedException(
        'Nenhuma senha cadastrada para este usuário',
      );

    const isCurrentValid = await this.pbkdf2Util.verify(
      dto.currentPassword,
      latestPassword.passwordHash,
    );
    if (!isCurrentValid)
      throw new UnauthorizedException('Senha atual incorreta');

    await this.assertPasswordNotReused(dto.newPassword, userId);

    const passwordHash = await this.pbkdf2Util.hash(dto.newPassword);

    await this.userPasswordRepository.save(
      new UserPasswordEntity({
        id: randomUUID(),
        userId,
        passwordHash,
        createdAt: new Date(),
      }),
    );
  }

  private async assertPasswordNotReused(
    newPassword: string,
    userId: string,
  ): Promise<void> {
    const allPasswords =
      await this.userPasswordRepository.findAllByUserId(userId);

    for (const existing of allPasswords) {
      const isReused = await this.pbkdf2Util.verify(
        newPassword,
        existing.passwordHash,
      );
      if (isReused) {
        throw new UnprocessableEntityException(
          'A nova senha não pode ser igual a uma senha já utilizada',
        );
      }
    }
  }
}
