import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { IUserRepository } from '../ports/i-user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const now = new Date();

    const user = new UserEntity({
      id: randomUUID(),
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

    await this.userRepository.save(user);

    return {
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
      birthdate: user.birthdate,
      active: user.active,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
