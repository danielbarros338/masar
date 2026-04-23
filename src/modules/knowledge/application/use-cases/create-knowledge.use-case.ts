import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { KnowledgeEntity } from '../../domain/entities/knowledge.entity';
import { CreateKnowledgeDto } from '../dto/create-knowledge.dto';
import { KnowledgeResponseDto } from '../dto/knowledge-response.dto';
import { IKnowledgeRepository } from '../ports/i-knowledge.repository';

@Injectable()
export class CreateKnowledgeUseCase {
  constructor(private readonly knowledgeRepository: IKnowledgeRepository) {}

  async execute(dto: CreateKnowledgeDto): Promise<KnowledgeResponseDto> {
    const now = new Date();

    const knowledge = new KnowledgeEntity({
      id: randomUUID(),
      botId: dto.botId,
      code: dto.code,
      behaviour: dto.behaviour,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });

    await this.knowledgeRepository.save(knowledge);

    return {
      id: knowledge.id,
      botId: knowledge.botId,
      code: knowledge.code,
      behaviour: knowledge.behaviour,
      createdAt: knowledge.createdAt,
      updatedAt: knowledge.updatedAt,
    };
  }
}
