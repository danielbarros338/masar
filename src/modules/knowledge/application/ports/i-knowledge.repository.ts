import { KnowledgeEntity } from '../../domain/entities/knowledge.entity';

export abstract class IKnowledgeRepository {
  abstract findById(id: string): Promise<KnowledgeEntity | null>;
  abstract save(entity: KnowledgeEntity): Promise<void>;
  abstract softDelete(id: string): Promise<void>;
}
