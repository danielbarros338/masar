import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncAiModelsResponseDto } from '../../application/dto/sync-ai-models-response.dto';

export const ApiSyncAiModels = () =>
  applyDecorators(
    ApiOperation({ summary: 'Sincroniza modelos disponíveis do provider de IA' }),
    ApiResponse({ status: 201, type: SyncAiModelsResponseDto }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
  );
