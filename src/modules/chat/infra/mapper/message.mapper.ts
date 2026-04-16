import { MessageEntity } from '../../domain/entities/message.entity';
import { MessageOrmEntity } from '../orm-entities/message.orm-entity';

export class MessageMapper {
  static toDomain(orm: MessageOrmEntity): MessageEntity {
    return new MessageEntity({
      id: orm.id,
      chatId: orm.chatId,
      message: orm.message,
      userType: orm.userType,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toPersistence(entity: MessageEntity): MessageOrmEntity {
    const orm = new MessageOrmEntity();
    orm.id = entity.id;
    orm.chatId = entity.chatId;
    orm.message = entity.message;
    orm.userType = entity.userType;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt ?? null;
    return orm;
  }
}
