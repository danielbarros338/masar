import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './api/controllers/chat.controller';
import { IChatRepository } from './application/ports/i-chat.repository';
import { IMessageRepository } from './application/ports/i-message.repository';
import { CreateChatUseCase } from './application/use-cases/create-chat.use-case';
import { CreateMessageUseCase } from './application/use-cases/create-message.use-case';
import { ChatOrmEntity } from './infra/orm-entities/chat.orm-entity';
import { MessageOrmEntity } from './infra/orm-entities/message.orm-entity';
import { ChatRepository } from './infra/repositories/chat.repository';
import { MessageRepository } from './infra/repositories/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatOrmEntity, MessageOrmEntity])],
  controllers: [ChatController],
  providers: [
    CreateChatUseCase,
    CreateMessageUseCase,
    { provide: IChatRepository, useClass: ChatRepository },
    { provide: IMessageRepository, useClass: MessageRepository },
  ],
})
export class ChatModule {}
