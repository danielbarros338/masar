import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BotResponseDto } from '../../application/dto/bot-response.dto';

export const ApiCreateBot = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo bot' }),
    ApiResponse({ status: 201, type: BotResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
  );

export const ApiListUserBots = () =>
  applyDecorators(
    ApiOperation({ summary: 'Lista todos os bots do usuário autenticado' }),
    ApiResponse({ status: 200, type: [BotResponseDto] }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
  );

export const ApiUpdateBot = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualiza um bot do usuário autenticado' }),
    ApiResponse({ status: 200, type: BotResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
    ApiResponse({ status: 404, description: 'Bot não encontrado' }),
  );

export const ApiDeleteBot = () =>
  applyDecorators(
    ApiOperation({ summary: 'Remove um bot do usuário autenticado' }),
    ApiResponse({ status: 204 }),
    ApiResponse({ status: 401, description: 'Não autenticado' }),
    ApiResponse({ status: 404, description: 'Bot não encontrado' }),
  );

