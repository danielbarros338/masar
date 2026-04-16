import { EntityManager } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract save(entity: UserEntity): Promise<void>;
  abstract saveWithManager(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<void>;
}
