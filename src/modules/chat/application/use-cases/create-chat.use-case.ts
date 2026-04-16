import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatEntity } from '../../domain/entities/chat.entity';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { CreateChatDto } from '../dto/create-chat.dto';
import { IChatRepository } from '../ports/i-chat.repository';

@Injectable()
export class CreateChatUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(dto: CreateChatDto): Promise<ChatResponseDto> {
    const now = new Date();

    const chat = new ChatEntity({
      id: randomUUID(),
      botId: dto.botId,
      phoneNumber: dto.phoneNumber ?? null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    await this.chatRepository.save(chat);

    return {
      id: chat.id,
      botId: chat.botId,
      phoneNumber: chat.phoneNumber,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
}
