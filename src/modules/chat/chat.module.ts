import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { ChatController } from './api/controllers/chat.controller';
import { IChatRepository } from './application/ports/i-chat.repository';
import { IMessagePublisher } from './application/ports/i-message-publisher';
import { IMessageRepository } from './application/ports/i-message.repository';
import { CreateChatUseCase } from './application/use-cases/create-chat.use-case';
import { CreateMessageUseCase } from './application/use-cases/create-message.use-case';
import { ProcessIncomingMessageUseCase } from './application/use-cases/process-incoming-message.use-case';
import { ChatOrmEntity } from './infra/orm-entities/chat.orm-entity';
import { MessageOrmEntity } from './infra/orm-entities/message.orm-entity';
import { RabbitmqConsumer } from './infra/rabbitmq/rabbitmq-consumer';
import { RabbitmqPublisher } from './infra/rabbitmq/rabbitmq-publisher';
import { RabbitmqService } from './infra/rabbitmq/rabbitmq.service';
import { ChatRepository } from './infra/repositories/chat.repository';
import { MessageRepository } from './infra/repositories/message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatOrmEntity, MessageOrmEntity]),
    CommonModule,
  ],
  controllers: [ChatController],
  providers: [
    CreateChatUseCase,
    CreateMessageUseCase,
    ProcessIncomingMessageUseCase,
    RabbitmqService,
    RabbitmqConsumer,
    { provide: IChatRepository, useClass: ChatRepository },
    { provide: IMessageRepository, useClass: MessageRepository },
    { provide: IMessagePublisher, useClass: RabbitmqPublisher },
  ],
})
export class ChatModule {}
