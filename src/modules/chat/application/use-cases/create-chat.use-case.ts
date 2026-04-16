import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatEntity } from '../../domain/entities/chat.entity';
import { ChatStatus } from '../../domain/message.types';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { CreateChatDto } from '../dto/create-chat.dto';
import { IChatRepository } from '../ports/i-chat.repository';

@Injectable()
export class CreateChatUseCase {
  private readonly logger = new Logger(CreateChatUseCase.name);

  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(dto: CreateChatDto): Promise<ChatResponseDto> {
    this.logger.log(`Criando chat: botId=${dto.botId}`);

    const now = new Date();

    const chat = new ChatEntity({
      id: randomUUID(),
      botId: dto.botId,
      phoneNumber: dto.phoneNumber ?? null,
      chatStatus: ChatStatus.BOT,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    await this.chatRepository.save(chat);

    this.logger.log(`Chat criado com id ${chat.id}`);

    return {
      id: chat.id,
      botId: chat.botId,
      phoneNumber: chat.phoneNumber,
      chatStatus: chat.chatStatus,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
