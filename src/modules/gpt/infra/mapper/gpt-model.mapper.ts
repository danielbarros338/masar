import { GptModelEntity } from '../../domain/entities/gpt-model.entity';
import { GptModelOrmEntity } from '../orm-entities/gpt-model.orm-entity';

export class GptModelMapper {
  static toDomain(orm: GptModelOrmEntity): GptModelEntity {
    return new GptModelEntity({
      id: orm.id,
      provider: orm.provider,
      modelId: orm.modelId,
      displayName: orm.displayName,
      isActive: orm.isActive,
      isDefault: orm.isDefault,
      isDeprecated: orm.isDeprecated,
      supportsChats: orm.supportsChats,
      supportsStreaming: orm.supportsStreaming,
      supportsReasoning: orm.supportsReasoning,
      supportsTools: orm.supportsTools,
      contextWindow: orm.contextWindow,
      maxOutputTokens: orm.maxOutputTokens,
      inputCost: Number(orm.inputCost),
      outputCost: Number(orm.outputCost),
      speedScore: orm.speedScore,
      qualityScore: orm.qualityScore,
      priority: orm.priority,
      metadata: orm.metadata,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toPersistence(entity: GptModelEntity): GptModelOrmEntity {
    const orm = new GptModelOrmEntity();
    orm.id = entity.id;
    orm.provider = entity.provider;
    orm.modelId = entity.modelId;
    orm.displayName = entity.displayName;
    orm.isActive = entity.isActive;
    orm.isDefault = entity.isDefault;
    orm.isDeprecated = entity.isDeprecated;
    orm.supportsChats = entity.supportsChats;
    orm.supportsStreaming = entity.supportsStreaming;
    orm.supportsReasoning = entity.supportsReasoning;
    orm.supportsTools = entity.supportsTools;
    orm.contextWindow = entity.contextWindow;
    orm.maxOutputTokens = entity.maxOutputTokens;
    orm.inputCost = entity.inputCost;
    orm.outputCost = entity.outputCost;
    orm.speedScore = entity.speedScore;
    orm.qualityScore = entity.qualityScore;
    orm.priority = entity.priority;
    orm.metadata = entity.metadata;
    orm.deletedAt = entity.deletedAt;
    return orm;
  }
}
