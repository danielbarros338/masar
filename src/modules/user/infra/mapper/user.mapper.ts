import { UserEntity } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): UserEntity {
    return new UserEntity({
      id: orm.id,
      firstname: orm.firstname,
      surname: orm.surname,
      email: orm.email,
      birthdate: orm.birthdate,
      active: orm.active,
      emailVerified: orm.emailVerified,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toPersistence(entity: UserEntity): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = entity.id;
    orm.firstname = entity.firstname;
    orm.surname = entity.surname;
    orm.email = entity.email;
    orm.birthdate = entity.birthdate;
    orm.active = entity.active;
    orm.emailVerified = entity.emailVerified;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt ?? null;
    return orm;
  }
}
