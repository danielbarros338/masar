import { Injectable } from '@nestjs/common';
import { GptModelResponseDto } from '../dto/gpt-model-response.dto';
import { IGptModelRepository } from '../ports/i-gpt-model.repository';

@Injectable()
export class ListAgentModelsUseCase {
  constructor(private readonly gptModelRepository: IGptModelRepository) {}

  async execute(): Promise<GptModelResponseDto[]> {
    const models = await this.gptModelRepository.findAll();
    return models.map((model) => ({
      id: model.id,
      provider: model.provider,
      modelId: model.modelId,
      displayName: model.displayName,
      isActive: model.isActive,
      isDefault: model.isDefault,
      isDeprecated: model.isDeprecated,
      supportsChats: model.supportsChats,
      supportsStreaming: model.supportsStreaming,
      supportsReasoning: model.supportsReasoning,
      supportsTools: model.supportsTools,
      contextWindow: model.contextWindow,
      maxOutputTokens: model.maxOutputTokens,
      inputCost: model.inputCost,
      outputCost: model.outputCost,
      speedScore: model.speedScore,
      qualityScore: model.qualityScore,
      priority: model.priority,
    }));
  }
}
