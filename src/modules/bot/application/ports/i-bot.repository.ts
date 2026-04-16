import { BotEntity } from '../../domain/entities/bot.entity';

export abstract class IBotRepository {
  abstract findById(id: string): Promise<BotEntity | null>;
  abstract save(entity: BotEntity): Promise<void>;
}
