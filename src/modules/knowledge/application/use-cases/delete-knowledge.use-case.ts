import { Injectable, NotFoundException } from '@nestjs/common';
import { IKnowledgeRepository } from '../ports/i-knowledge.repository';

@Injectable()
export class DeleteKnowledgeUseCase {
  constructor(private readonly knowledgeRepository: IKnowledgeRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.knowledgeRepository.findById(id);

    if (!existing)
      throw new NotFoundException(`Knowledge com id "${id}" não encontrado`);

    await this.knowledgeRepository.softDelete(id);
  }
}
