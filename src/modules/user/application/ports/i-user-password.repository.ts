import { EntityManager } from 'typeorm';
import { UserPasswordEntity } from '../../domain/entities/user-password.entity';

export abstract class IUserPasswordRepository {
  abstract save(entity: UserPasswordEntity): Promise<void>;
  abstract saveWithManager(
    entity: UserPasswordEntity,
    manager: EntityManager,
  ): Promise<void>;
  abstract findLatestByUserId(
    userId: string,
  ): Promise<UserPasswordEntity | null>;
  abstract findAllByUserId(userId: string): Promise<UserPasswordEntity[]>;
}
