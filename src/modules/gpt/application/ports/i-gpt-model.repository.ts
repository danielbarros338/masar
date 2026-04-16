import { GptModelEntity } from '../../domain/entities/gpt-model.entity';

export abstract class IGptModelRepository {
  abstract findById(id: string): Promise<GptModelEntity | null>;
  abstract findByModelId(modelId: string): Promise<GptModelEntity | null>;
  abstract findDefault(): Promise<GptModelEntity | null>;
  abstract findAllModelIds(): Promise<string[]>;
  abstract save(entity: GptModelEntity): Promise<void>;
  abstract saveMany(entities: GptModelEntity[]): Promise<void>;
}
