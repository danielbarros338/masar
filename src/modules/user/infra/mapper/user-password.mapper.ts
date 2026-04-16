import { UserPasswordEntity } from '../../domain/entities/user-password.entity';
import { UserPasswordOrmEntity } from '../orm-entities/user-password.orm-entity';

export class UserPasswordMapper {
  static toDomain(orm: UserPasswordOrmEntity): UserPasswordEntity {
    return new UserPasswordEntity({
      id: orm.id,
      userId: orm.userId,
      passwordHash: orm.passwordHash,
      createdAt: orm.createdAt,
    });
  }

  static toPersistence(entity: UserPasswordEntity): UserPasswordOrmEntity {
    const orm = new UserPasswordOrmEntity();
    orm.id = entity.id;
    orm.userId = entity.userId;
    orm.passwordHash = entity.passwordHash;
    orm.createdAt = entity.createdAt;
    return orm;
  }
}
