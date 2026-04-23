import { BotEntity } from '../../domain/entities/bot.entity';

export abstract class IBotRepository {
  abstract findById(id: string): Promise<BotEntity | null>;
  abstract findAllByUserId(userId: string): Promise<BotEntity[]>;
  abstract findByIdAndUserId(id: string, userId: string): Promise<BotEntity | null>;
  abstract findByPhoneNumber(phoneNumber: string): Promise<BotEntity | null>;
  abstract save(entity: BotEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
