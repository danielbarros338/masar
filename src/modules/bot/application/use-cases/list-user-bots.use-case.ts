import { Injectable } from '@nestjs/common';
import { BotResponseDto } from '../dto/bot-response.dto';
import { IBotRepository } from '../ports/i-bot.repository';

@Injectable()
export class ListUserBotsUseCase {
  constructor(private readonly botRepository: IBotRepository) {}

  async execute(userId: string): Promise<BotResponseDto[]> {
    const bots = await this.botRepository.findAllByUserId(userId);

    return bots.map((bot) => ({
      id: bot.id,
      name: bot.name,
      type: bot.type,
      modelId: bot.modelId,
      language: bot.language,
      persona: bot.persona,
      phoneNumber: bot.phoneNumber,
      userId: bot.userId,
      createdAt: bot.createdAt,
      updatedAt: bot.updatedAt,
    }));
  }
}
