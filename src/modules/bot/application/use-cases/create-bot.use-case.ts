import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BotEntity } from '../../domain/entities/bot.entity';
import { BotResponseDto } from '../dto/bot-response.dto';
import { CreateBotDto } from '../dto/create-bot.dto';
import { IBotRepository } from '../ports/i-bot.repository';

@Injectable()
export class CreateBotUseCase {
  constructor(private readonly botRepository: IBotRepository) {}

  async execute(dto: CreateBotDto, userId: string): Promise<BotResponseDto> {
    const now = new Date();

    const bot = new BotEntity({
      id: randomUUID(),
      name: dto.name,
      type: dto.type,
      modelId: dto.modelId,
      language: dto.language,
      phoneNumber: dto.phoneNumber,
      userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    await this.botRepository.save(bot);

    return {
      id: bot.id,
      name: bot.name,
      type: bot.type,
      modelId: bot.modelId,
      language: bot.language,
      phoneNumber: bot.phoneNumber,
      userId: bot.userId,
      createdAt: bot.createdAt,
      updatedAt: bot.updatedAt,
    };
  }
}
