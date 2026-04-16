import { ChatEntity } from '../../domain/entities/chat.entity';
import { ChatOrmEntity } from '../orm-entities/chat.orm-entity';

export class ChatMapper {
  static toDomain(orm: ChatOrmEntity): ChatEntity {
    return new ChatEntity({
      id: orm.id,
      botId: orm.botId,
      phoneNumber: orm.phoneNumber,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toPersistence(entity: ChatEntity): ChatOrmEntity {
    const orm = new ChatOrmEntity();
    orm.id = entity.id;
    orm.botId = entity.botId;
    orm.phoneNumber = entity.phoneNumber ?? null;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt ?? null;
    return orm;
  }
}
