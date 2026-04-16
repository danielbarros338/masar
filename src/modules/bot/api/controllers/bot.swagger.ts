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
