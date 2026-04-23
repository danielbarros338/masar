import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatAgentResponseDto } from '../../application/dto/chat-agent-response.dto';
import { GptModelResponseDto } from '../../application/dto/gpt-model-response.dto';
import { SyncAiModelsResponseDto } from '../../application/dto/sync-ai-models-response.dto';

export const ApiChatAgent = () =>
  applyDecorators(
    ApiOperation({ summary: 'Envia um prompt ao agente de IA e retorna a resposta' }),
    ApiResponse({ status: 200, type: ChatAgentResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
  );

export const ApiListAgentModels = () =>
  applyDecorators(
    ApiOperation({ summary: 'Lista os modelos de IA cadastrados' }),
    ApiResponse({ status: 200, type: [GptModelResponseDto] }),
  );

export const ApiSyncAiModels = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sincroniza modelos disponíveis do provider de IA',
    }),
    ApiResponse({ status: 201, type: SyncAiModelsResponseDto }),
  );
