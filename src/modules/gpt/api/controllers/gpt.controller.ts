import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatGptResponseDto } from '../../application/dto/chat-gpt-response.dto';
import { ChatGptDto } from '../../application/dto/chat-gpt.dto';
import { GptModelResponseDto } from '../../application/dto/gpt-model-response.dto';
import { SyncAiModelsResponseDto } from '../../application/dto/sync-ai-models-response.dto';
import { ChatGptUseCase } from '../../application/use-cases/chat-gpt.use-case';
import { ListGptModelsUseCase } from '../../application/use-cases/list-gpt-models.use-case';
import { SyncAiModelsUseCase } from '../../application/use-cases/sync-ai-models.use-case';
import { ApiListGptModels, ApiSyncAiModels } from './gpt.swagger';

@ApiTags('gpt')
@ApiBearerAuth()
@Controller('gpt')
export class GptController {
  constructor(
    private readonly chatGpt: ChatGptUseCase,
    private readonly listGptModels: ListGptModelsUseCase,
    private readonly syncAiModels: SyncAiModelsUseCase,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  chat(@Body() dto: ChatGptDto): Promise<ChatGptResponseDto> {
    return this.chatGpt.execute(dto);
  }

  @Get('models')
  @ApiListGptModels()
  listModels(): Promise<GptModelResponseDto[]> {
    return this.listGptModels.execute();
  }

  @Post('sync-models')
  @ApiSyncAiModels()
  syncModels(): Promise<SyncAiModelsResponseDto> {
    return this.syncAiModels.execute();
  }
}
