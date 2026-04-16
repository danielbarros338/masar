import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentController } from './api/controllers/agent.controller';
import { IAiProvider } from './application/ports/i-ai-provider';
import { IGptModelRepository } from './application/ports/i-gpt-model.repository';
import { ChatAgentUseCase } from './application/use-cases/chat-agent.use-case';
import { ListAgentModelsUseCase } from './application/use-cases/list-agent-models.use-case';
import { SyncAiModelsUseCase } from './application/use-cases/sync-ai-models.use-case';
import { GptModelOrmEntity } from './infra/orm-entities/gpt-model.orm-entity';
import { OpenaiProvider } from './infra/providers/openai.provider';
import { GptModelRepository } from './infra/repositories/gpt-model.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GptModelOrmEntity])],
  controllers: [AgentController],
  providers: [
    ChatAgentUseCase,
    ListAgentModelsUseCase,
    SyncAiModelsUseCase,
    { provide: IAiProvider, useClass: OpenaiProvider },
    { provide: IGptModelRepository, useClass: GptModelRepository },
  ],
  exports: [IAiProvider, IGptModelRepository],
})
export class AgentModule {}
