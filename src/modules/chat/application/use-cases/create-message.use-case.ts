import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MessageEntity } from '../../domain/entities/message.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { IMessageRepository } from '../ports/i-message.repository';

@Injectable()
export class CreateMessageUseCase {
  constructor(private readonly messageRepository: IMessageRepository) {}

  async execute(dto: CreateMessageDto): Promise<MessageResponseDto> {
    const now = new Date();

    const message = new MessageEntity({
      id: randomUUID(),
      chatId: dto.chatId,
      message: dto.message,
      userType: dto.userType,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    await this.messageRepository.save(message);

    return {
      id: message.id,
      chatId: message.chatId,
      message: message.message,
      userType: message.userType,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
