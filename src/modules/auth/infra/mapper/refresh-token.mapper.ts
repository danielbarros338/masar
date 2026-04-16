import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenOrmEntity } from '../orm-entities/refresh-token.orm-entity';

export class RefreshTokenMapper {
  static toDomain(orm: RefreshTokenOrmEntity): RefreshTokenEntity {
    return new RefreshTokenEntity({
      id: orm.id,
      userId: orm.userId,
      expiresAt: orm.expiresAt,
      revokedAt: orm.revokedAt,
      createdAt: orm.createdAt,
    });
  }

  static toPersistence(entity: RefreshTokenEntity): RefreshTokenOrmEntity {
    const orm = new RefreshTokenOrmEntity();
    orm.id = entity.id;
    orm.userId = entity.userId;
    orm.expiresAt = entity.expiresAt;
    orm.revokedAt = entity.revokedAt;
    orm.createdAt = entity.createdAt;
    return orm;
  }
}
