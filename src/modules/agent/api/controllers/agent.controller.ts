import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatAgentResponseDto } from '../../application/dto/chat-agent-response.dto';
import { ChatAgentDto } from '../../application/dto/chat-agent.dto';
import { GptModelResponseDto } from '../../application/dto/gpt-model-response.dto';
import { SyncAiModelsResponseDto } from '../../application/dto/sync-ai-models-response.dto';
import { ChatAgentUseCase } from '../../application/use-cases/chat-agent.use-case';
import { ListAgentModelsUseCase } from '../../application/use-cases/list-agent-models.use-case';
import { SyncAiModelsUseCase } from '../../application/use-cases/sync-ai-models.use-case';
import { ApiListAgentModels, ApiSyncAiModels } from './agent.swagger';

@ApiTags('agent')
@ApiBearerAuth()
@Controller('agent')
export class AgentController {
  constructor(
    private readonly chatAgent: ChatAgentUseCase,
    private readonly listAgentModels: ListAgentModelsUseCase,
    private readonly syncAiModels: SyncAiModelsUseCase,
  ) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  chat(@Body() dto: ChatAgentDto): Promise<ChatAgentResponseDto> {
    return this.chatAgent.execute(dto);
  }

  @Get('models')
  @ApiListAgentModels()
  listModels(): Promise<GptModelResponseDto[]> {
    return this.listAgentModels.execute();
  }

  @Post('sync-models')
  @ApiSyncAiModels()
  syncModels(): Promise<SyncAiModelsResponseDto> {
    return this.syncAiModels.execute();
  }
}
