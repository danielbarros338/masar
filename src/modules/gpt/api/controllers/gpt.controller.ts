import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatGptResponseDto } from '../../application/dto/chat-gpt-response.dto';
import { ChatGptDto } from '../../application/dto/chat-gpt.dto';
import { SyncAiModelsResponseDto } from '../../application/dto/sync-ai-models-response.dto';
import { ChatGptUseCase } from '../../application/use-cases/chat-gpt.use-case';
import { SyncAiModelsUseCase } from '../../application/use-cases/sync-ai-models.use-case';
import { ApiSyncAiModels } from './gpt.swagger';

@ApiTags('gpt')
@ApiBearerAuth()
@Controller('gpt')
export class GptController {
  constructor(
    private readonly chatGpt: ChatGptUseCase,
    private readonly syncAiModels: SyncAiModelsUseCase,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  chat(@Body() dto: ChatGptDto): Promise<ChatGptResponseDto> {
    return this.chatGpt.execute(dto);
  }

  @Post('sync-models')
  @ApiSyncAiModels()
  syncModels(): Promise<SyncAiModelsResponseDto> {
    return this.syncAiModels.execute();
  }
}
