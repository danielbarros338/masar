import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatGptResponseDto } from '../dto/chat-gpt-response.dto';
import { ChatGptDto } from '../dto/chat-gpt.dto';
import { IAiProvider } from '../ports/i-ai-provider';
import { IGptModelRepository } from '../ports/i-gpt-model.repository';

@Injectable()
export class ChatGptUseCase {
  constructor(
    private readonly aiProvider: IAiProvider,
    private readonly gptModelRepository: IGptModelRepository,
  ) {}

  async execute(dto: ChatGptDto): Promise<ChatGptResponseDto> {
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
