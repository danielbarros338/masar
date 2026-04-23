import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IKnowledgeRepository } from '../../application/ports/i-knowledge.repository';
import { KnowledgeEntity } from '../../domain/entities/knowledge.entity';
import { KnowledgeMapper } from '../mapper/knowledge.mapper';
import { KnowledgeOrmEntity } from '../orm-entities/knowledge.orm-entity';

@Injectable()
export class KnowledgeRepository extends IKnowledgeRepository {
  constructor(
    @InjectRepository(KnowledgeOrmEntity)
    private readonly repo: Repository<KnowledgeOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<KnowledgeEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? KnowledgeMapper.toDomain(orm) : null;
  }

  async save(entity: KnowledgeEntity): Promise<void> {
    const orm = KnowledgeMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
