import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { AgentModule } from '../agent/agent.module';
import { BotModule } from '../bot/bot.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { ChatController } from './api/controllers/chat.controller';
import { IChatRepository } from './application/ports/i-chat.repository';
import { IMessagePublisher } from './application/ports/i-message-publisher';
import { IMessageRepository } from './application/ports/i-message.repository';
import { IWhatsappProvider } from './application/ports/i-whatsapp-provider';
import { CreateChatUseCase } from './application/use-cases/create-chat.use-case';
import { CreateMessageUseCase } from './application/use-cases/create-message.use-case';
import { ProcessIncomingMessageUseCase } from './application/use-cases/process-incoming-message.use-case';
import { ProcessIncomingWhatsappMessageUseCase } from './application/use-cases/process-incoming-whatsapp-message.use-case';
import { ChatOrmEntity } from './infra/orm-entities/chat.orm-entity';
import { MessageOrmEntity } from './infra/orm-entities/message.orm-entity';
import { InfobipWhatsappProvider } from './infra/providers/infobip-whatsapp.provider';
import { RabbitmqConsumer } from './infra/rabbitmq/rabbitmq-consumer';
import { RabbitmqPublisher } from './infra/rabbitmq/rabbitmq-publisher';
import { RabbitmqService } from './infra/rabbitmq/rabbitmq.service';
import { ChatRepository } from './infra/repositories/chat.repository';
import { MessageRepository } from './infra/repositories/message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatOrmEntity, MessageOrmEntity]),
    CommonModule,
    BotModule,
    AgentModule,
    KnowledgeModule,
  ],
  controllers: [ChatController],
  providers: [
    CreateChatUseCase,
    CreateMessageUseCase,
    ProcessIncomingMessageUseCase,
    ProcessIncomingWhatsappMessageUseCase,
    RabbitmqService,
    RabbitmqConsumer,
    { provide: IChatRepository, useClass: ChatRepository },
    { provide: IMessageRepository, useClass: MessageRepository },
    { provide: IMessagePublisher, useClass: RabbitmqPublisher },
    { provide: IWhatsappProvider, useClass: InfobipWhatsappProvider },
  ],
})
export class ChatModule {}
