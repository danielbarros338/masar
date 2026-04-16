import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Pbkdf2Util } from '../../../../common/utils/pbkdf2.util';
import { UserPasswordEntity } from '../../domain/entities/user-password.entity';
import { SaveUserPasswordRequestDto } from '../dto/save-user-password-request.dto';
import { SaveUserPasswordResponseDto } from '../dto/save-user-password-response.dto';
import { IUserPasswordRepository } from '../ports/i-user-password.repository';
import { IUserRepository } from '../ports/i-user.repository';

@Injectable()
export class SaveUserPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userPasswordRepository: IUserPasswordRepository,
    private readonly pbkdf2Util: Pbkdf2Util,
  ) {}

  async execute(
    dto: SaveUserPasswordRequestDto,
  ): Promise<SaveUserPasswordResponseDto> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundException(
        `Usuário com id "${dto.userId}" não encontrado`,
      );
    }

    const passwordHash = await this.pbkdf2Util.hash(dto.password);

    const userPassword = new UserPasswordEntity({
      id: randomUUID(),
      userId: user.id,
      passwordHash,
      createdAt: new Date(),
    });

    await this.userPasswordRepository.save(userPassword);

    return {
      id: userPassword.id,
      userId: userPassword.userId,
      createdAt: userPassword.createdAt,
    };
  }
}
