import { Injectable, NotFoundException } from '@nestjs/common';
import { IBotRepository } from '../ports/i-bot.repository';

@Injectable()
export class DeleteBotUseCase {
  constructor(private readonly botRepository: IBotRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const bot = await this.botRepository.findByIdAndUserId(id, userId);

    if (!bot) throw new NotFoundException('Bot', id);

    await this.botRepository.delete(id);
  }
}
