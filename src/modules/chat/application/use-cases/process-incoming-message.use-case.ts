import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITransactionManager } from '../../../../common/ports/i-transaction-manager';
import { IAiProvider } from '../../../agent/application/ports/i-ai-provider';
import { IGptModelRepository } from '../../../agent/application/ports/i-gpt-model.repository';
import { IBotRepository } from '../../../bot/application/ports/i-bot.repository';
import { IKnowledgeRepository } from '../../../knowledge/application/ports/i-knowledge.repository';
import { ChatEntity } from '../../domain/entities/chat.entity';
import { MessageEntity } from '../../domain/entities/message.entity';
import {
    ChatStatus,
    IncomingMessagePayload,
    UserType,
} from '../../domain/message.types';
import { MessageResponseDto } from '../dto/message-response.dto';
import { IChatRepository } from '../ports/i-chat.repository';
import { IMessageRepository } from '../ports/i-message.repository';

@Injectable()
export class ProcessIncomingMessageUseCase {
  private readonly logger = new Logger(ProcessIncomingMessageUseCase.name);

  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly messageRepository: IMessageRepository,
    private readonly botRepository: IBotRepository,
    private readonly gptModelRepository: IGptModelRepository,
    private readonly aiProvider: IAiProvider,
    private readonly transactionManager: ITransactionManager,
    private readonly knowledgeRepository: IKnowledgeRepository,
  ) {}

  async execute(payload: IncomingMessagePayload): Promise<MessageResponseDto> {
    this.logger.log(
      `Processando mensagem: botId=${payload.botId} phoneNumber=${payload.phoneNumber}`,
    );

    const bot = await this.botRepository.findById(payload.botId);
    if (!bot) {
      throw new NotFoundException(
        `Bot com id "${payload.botId}" não encontrado`,
      );
    }

    const model = await this.gptModelRepository.findById(bot.modelId);
    if (!model) {
      throw new NotFoundException(
        `Modelo GPT com id "${bot.modelId}" não encontrado`,
      );
    }

    const knowledges = await this.knowledgeRepository.findByBotId(
      payload.botId,
    );

    const systemPrompt = this.buildSystemPrompt(
      bot.persona,
      bot.language,
      knowledges.map((k) => k.behaviour),
    );

    const botResponse = await this.aiProvider.complete(
      payload.message,
      model.modelId,
      systemPrompt,
    );

    return this.transactionManager.run(async (manager) => {
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

      const userMessage = new MessageEntity({
        id: randomUUID(),
        chatId: chat.id,
        message: payload.message,
        userType: payload.userType,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      await this.messageRepository.saveWithManager(userMessage, manager);

      this.logger.log(
        `Mensagem do usuário salva: chatId=${chat.id} messageId=${userMessage.id}`,
      );

      const responseMessage = new MessageEntity({
        id: randomUUID(),
        chatId: chat.id,
        message: botResponse,
        userType: UserType.BOT,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      await this.messageRepository.saveWithManager(responseMessage, manager);

      this.logger.log(
        `Resposta do bot salva: chatId=${chat.id} messageId=${responseMessage.id} modelId=${model.modelId}`,
      );

      return {
        id: responseMessage.id,
        chatId: responseMessage.chatId,
        message: responseMessage.message,
        userType: responseMessage.userType,
        createdAt: responseMessage.createdAt,
        updatedAt: responseMessage.updatedAt,
      };
    });
  }

  private buildSystemPrompt(
    persona: string,
    language: string,
    behaviours: string[],
  ): string {
    const parts: string[] = [`Persona:\n${persona}`];

    if (behaviours.length > 0) {
      const knowledgeSection = behaviours
        .map((b) => `- ${b}`)
        .join('\n');
      parts.push(`Base de conhecimento:\n${knowledgeSection}`);
    }

    parts.push(`Responda sempre em: ${language}`);

    return parts.join('\n\n');
  }
}
