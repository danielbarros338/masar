import { KnowledgeEntity } from '../../domain/entities/knowledge.entity';
import { KnowledgeOrmEntity } from '../orm-entities/knowledge.orm-entity';

export class KnowledgeMapper {
  static toDomain(orm: KnowledgeOrmEntity): KnowledgeEntity {
    return new KnowledgeEntity({
      id: orm.id,
      botId: orm.botId,
      code: orm.code,
      behaviour: orm.behaviour,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toPersistence(entity: KnowledgeEntity): KnowledgeOrmEntity {
    const orm = new KnowledgeOrmEntity();
    orm.id = entity.id;
    orm.botId = entity.botId;
    orm.code = entity.code;
    orm.behaviour = entity.behaviour;
    orm.createdAt = entity.createdAt;
    orm.updatedAt = entity.updatedAt;
    orm.deletedAt = entity.deletedAt ?? null;
    return orm;
  }
}
