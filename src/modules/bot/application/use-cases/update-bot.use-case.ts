import { Injectable, NotFoundException } from '@nestjs/common';
import { BotResponseDto } from '../dto/bot-response.dto';
import { UpdateBotDto } from '../dto/update-bot.dto';
import { IBotRepository } from '../ports/i-bot.repository';

@Injectable()
export class UpdateBotUseCase {
  constructor(private readonly botRepository: IBotRepository) {}

  async execute(id: string, dto: UpdateBotDto, userId: string): Promise<BotResponseDto> {
    const bot = await this.botRepository.findByIdAndUserId(id, userId);

    if (!bot) throw new NotFoundException('Bot', id);

    bot.update(dto);
    await this.botRepository.save(bot);

    return {
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
    };
  }
}
