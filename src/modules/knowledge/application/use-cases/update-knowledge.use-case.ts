import { Injectable, NotFoundException } from '@nestjs/common';
import { KnowledgeEntity } from '../../domain/entities/knowledge.entity';
import { KnowledgeResponseDto } from '../dto/knowledge-response.dto';
import { UpdateKnowledgeDto } from '../dto/update-knowledge.dto';
import { IKnowledgeRepository } from '../ports/i-knowledge.repository';

@Injectable()
export class UpdateKnowledgeUseCase {
  constructor(private readonly knowledgeRepository: IKnowledgeRepository) {}

  async execute(
    id: string,
    dto: UpdateKnowledgeDto,
  ): Promise<KnowledgeResponseDto> {
    const existing = await this.knowledgeRepository.findById(id);

    if (!existing)
      throw new NotFoundException(`Knowledge com id "${id}" não encontrado`);

    const updated = new KnowledgeEntity({
      id: existing.id,
      botId: existing.botId,
      code: dto.code ?? existing.code,
      behaviour: dto.behaviour ?? existing.behaviour,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      deletedAt: existing.deletedAt,
    });

    await this.knowledgeRepository.save(updated);

    return {
      id: updated.id,
      botId: updated.botId,
      code: updated.code,
      behaviour: updated.behaviour,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
