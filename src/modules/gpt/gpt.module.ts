import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptController } from './api/controllers/gpt.controller';
import { IAiProvider } from './application/ports/i-ai-provider';
import { IGptModelRepository } from './application/ports/i-gpt-model.repository';
import { ChatGptUseCase } from './application/use-cases/chat-gpt.use-case';
import { SyncAiModelsUseCase } from './application/use-cases/sync-ai-models.use-case';
import { GptModelOrmEntity } from './infra/orm-entities/gpt-model.orm-entity';
import { OpenaiProvider } from './infra/providers/openai.provider';
import { GptModelRepository } from './infra/repositories/gpt-model.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GptModelOrmEntity])],
  controllers: [GptController],
  providers: [
    ChatGptUseCase,
    SyncAiModelsUseCase,
    { provide: IAiProvider, useClass: OpenaiProvider },
    { provide: IGptModelRepository, useClass: GptModelRepository },
  ],
})
export class GptModule {}
