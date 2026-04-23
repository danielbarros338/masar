import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeController } from './api/controllers/knowledge.controller';
import { IKnowledgeRepository } from './application/ports/i-knowledge.repository';
import { CreateKnowledgeUseCase } from './application/use-cases/create-knowledge.use-case';
import { DeleteKnowledgeUseCase } from './application/use-cases/delete-knowledge.use-case';
import { GetKnowledgeUseCase } from './application/use-cases/get-knowledge.use-case';
import { UpdateKnowledgeUseCase } from './application/use-cases/update-knowledge.use-case';
import { KnowledgeOrmEntity } from './infra/orm-entities/knowledge.orm-entity';
import { KnowledgeRepository } from './infra/repositories/knowledge.repository';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeOrmEntity])],
  controllers: [KnowledgeController],
  providers: [
    CreateKnowledgeUseCase,
    UpdateKnowledgeUseCase,
    DeleteKnowledgeUseCase,
    GetKnowledgeUseCase,
    { provide: IKnowledgeRepository, useClass: KnowledgeRepository },
  ],
  exports: [IKnowledgeRepository],
})
export class KnowledgeModule {}
