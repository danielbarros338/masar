import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatAgentResponseDto } from '../dto/chat-agent-response.dto';
import { ChatAgentDto } from '../dto/chat-agent.dto';
import { IAiProvider } from '../ports/i-ai-provider';
import { IGptModelRepository } from '../ports/i-gpt-model.repository';

@Injectable()
export class ChatAgentUseCase {
  constructor(
    private readonly aiProvider: IAiProvider,
    private readonly gptModelRepository: IGptModelRepository,
  ) {}

  async execute(dto: ChatAgentDto): Promise<ChatAgentResponseDto> {
    const model = dto.modelId
      ? await this.gptModelRepository.findByModelId(dto.modelId)
      : await this.gptModelRepository.findDefault();

    if (!model) {
      throw new NotFoundException('Nenhum modelo GPT disponível');
    }

    const response = await this.aiProvider.complete(dto.prompt, model.modelId);

    return { response, modelId: model.modelId };
  }
}
