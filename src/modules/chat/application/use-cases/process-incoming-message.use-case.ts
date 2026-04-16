import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITransactionManager } from '../../../../common/ports/i-transaction-manager';
import { ChatEntity } from '../../domain/entities/chat.entity';
import { MessageEntity } from '../../domain/entities/message.entity';
import { ChatStatus, IncomingMessagePayload } from '../../domain/message.types';
import { IChatRepository } from '../ports/i-chat.repository';
import { IMessageRepository } from '../ports/i-message.repository';

@Injectable()
export class ProcessIncomingMessageUseCase {
  private readonly logger = new Logger(ProcessIncomingMessageUseCase.name);

  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(payload: IncomingMessagePayload): Promise<void> {
    this.logger.log(
      `Processando mensagem: botId=${payload.botId} phoneNumber=${payload.phoneNumber}`,
    );

    await this.transactionManager.run(async (manager) => {
      const now = new Date();

      let chat = await this.chatRepository.findOpenChat(
        payload.botId,
        payload.phoneNumber,
      );

      if (!chat) {
        this.logger.log(
          `Nenhuma conversa aberta encontrada, criando nova: botId=${payload.botId}`,
        );
        chat = new ChatEntity({
          id: randomUUID(),
          botId: payload.botId,
          phoneNumber: payload.phoneNumber,
          chatStatus: ChatStatus.BOT,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        });
        await this.chatRepository.saveWithManager(chat, manager);
      }

      const message = new MessageEntity({
        id: randomUUID(),
        chatId: chat.id,
        message: payload.message,
        userType: payload.userType,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      await this.messageRepository.saveWithManager(message, manager);

      this.logger.log(
        `Mensagem salva: chatId=${chat.id} messageId=${message.id}`,
      );
    });
  }
}
