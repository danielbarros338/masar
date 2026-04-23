import { Injectable, NotFoundException } from '@nestjs/common';
import { KnowledgeResponseDto } from '../dto/knowledge-response.dto';
import { IKnowledgeRepository } from '../ports/i-knowledge.repository';

@Injectable()
export class GetKnowledgeUseCase {
  constructor(private readonly knowledgeRepository: IKnowledgeRepository) {}

  async execute(id: string): Promise<KnowledgeResponseDto> {
    const knowledge = await this.knowledgeRepository.findById(id);

    if (!knowledge)
      throw new NotFoundException(`Knowledge com id "${id}" não encontrado`);

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
