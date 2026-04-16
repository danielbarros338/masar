import { BotEntity } from '../../domain/entities/bot.entity';
import { BotOrmEntity } from '../orm-entities/bot.orm-entity';

export class BotMapper {
  static toDomain(orm: BotOrmEntity): BotEntity {
    return new BotEntity({
      id: orm.id,
      name: orm.name,
      type: orm.type,
      modelId: orm.modelId,
      language: orm.language,
      phoneNumber: orm.phoneNumber,
      userId: orm.userId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toPersistence(entity: BotEntity): BotOrmEntity {
    const orm = new BotOrmEntity();
    orm.id = entity.id;
    orm.name = entity.name;
    orm.type = entity.type;
    orm.modelId = entity.modelId;
    orm.language = entity.language;
    orm.phoneNumber = entity.phoneNumber;
    orm.userId = entity.userId;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt ?? null;
    return orm;
  }
}
