import { ChatEntity } from '../../domain/entities/chat.entity';

export abstract class IChatRepository {
  abstract findById(id: string): Promise<ChatEntity | null>;
  abstract save(entity: ChatEntity): Promise<void>;
}
