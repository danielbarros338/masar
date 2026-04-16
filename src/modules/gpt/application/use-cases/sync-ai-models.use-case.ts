import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GptModelEntity } from '../../domain/entities/gpt-model.entity';
import { SyncAiModelsResponseDto } from '../dto/sync-ai-models-response.dto';
import { IAiProvider } from '../ports/i-ai-provider';
import { IGptModelRepository } from '../ports/i-gpt-model.repository';

@Injectable()
export class SyncAiModelsUseCase {
  private readonly logger = new Logger(SyncAiModelsUseCase.name);

  constructor(
    private readonly aiProvider: IAiProvider,
    private readonly gptModelRepository: IGptModelRepository,
  ) {}

  async execute(): Promise<SyncAiModelsResponseDto> {
    this.logger.log(`Sincronizando modelos do provider: ${this.aiProvider.providerName}`);

    const [availableIds, existingIds] = await Promise.all([
      this.aiProvider.listModels(),
      this.gptModelRepository.findAllModelIds(),
    ]);

    const existingSet = new Set(existingIds);
    const newModelIds = availableIds.filter((id) => !existingSet.has(id));

    if (newModelIds.length === 0) {
      this.logger.log('Nenhum modelo novo encontrado');
      return { addedModels: [] };
    }

    const now = new Date();
    const entities = newModelIds.map(
      (modelId) =>
        new GptModelEntity({
          id: randomUUID(),
          provider: this.aiProvider.providerName,
          modelId,
          displayName: modelId,
          isActive: true,
          isDefault: false,
          isDeprecated: false,
          supportsChats: true,
          supportsStreaming: false,
          supportsReasoning: false,
          supportsTools: false,
          contextWindow: 0,
          maxOutputTokens: 0,
          inputCost: 0,
          outputCost: 0,
          speedScore: 0,
          qualityScore: 0,
          priority: 0,
          metadata: null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        }),
    );

    await this.gptModelRepository.saveMany(entities);

    this.logger.log(`${newModelIds.length} modelo(s) adicionado(s): ${newModelIds.join(', ')}`);

    return { addedModels: newModelIds };
  }
}
