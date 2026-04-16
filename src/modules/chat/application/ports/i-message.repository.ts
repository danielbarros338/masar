import { EntityManager } from 'typeorm';
import { MessageEntity } from '../../domain/entities/message.entity';

export abstract class IMessageRepository {
  abstract findById(id: string): Promise<MessageEntity | null>;
  abstract findByChatId(chatId: string): Promise<MessageEntity[]>;
  abstract save(entity: MessageEntity): Promise<void>;
  abstract saveWithManager(
    entity: MessageEntity,
    manager: EntityManager,
  ): Promise<void>;
}
