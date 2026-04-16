import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GptModelResponseDto } from '../../application/dto/gpt-model-response.dto';
import { SyncAiModelsResponseDto } from '../../application/dto/sync-ai-models-response.dto';

export const ApiListAgentModels = () =>
  applyDecorators(
    ApiOperation({ summary: 'Lista os modelos de IA cadastrados' }),
    ApiResponse({ status: 200, type: [GptModelResponseDto] }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
  );

export const ApiSyncAiModels = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Sincroniza modelos disponíveis do provider de IA',
    }),
    ApiResponse({ status: 201, type: SyncAiModelsResponseDto }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
  );
