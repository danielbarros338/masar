import { EntityManager } from 'typeorm';
import { ChatEntity } from '../../domain/entities/chat.entity';

export abstract class IChatRepository {
  abstract findById(id: string): Promise<ChatEntity | null>;
  abstract findOpenChat(
    botId: string,
    phoneNumber: string,
  ): Promise<ChatEntity | null>;
  abstract save(entity: ChatEntity): Promise<void>;
  abstract saveWithManager(
    entity: ChatEntity,
    manager: EntityManager,
  ): Promise<void>;
}
