import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KnowledgeResponseDto } from '../../application/dto/knowledge-response.dto';

export const ApiCreateKnowledge = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo knowledge' }),
    ApiResponse({ status: 201, type: KnowledgeResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
  );

export const ApiUpdateKnowledge = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualiza um knowledge pelo ID' }),
    ApiResponse({ status: 200, type: KnowledgeResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 404, description: 'Knowledge não encontrado' }),
  );

export const ApiDeleteKnowledge = () =>
  applyDecorators(
    ApiOperation({ summary: 'Remove um knowledge pelo ID' }),
    ApiResponse({ status: 204 }),
    ApiResponse({ status: 404, description: 'Knowledge não encontrado' }),
  );

export const ApiGetKnowledge = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retorna um knowledge pelo ID' }),
    ApiResponse({ status: 200, type: KnowledgeResponseDto }),
    ApiResponse({ status: 404, description: 'Knowledge não encontrado' }),
  );
