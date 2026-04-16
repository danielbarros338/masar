import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatResponseDto } from '../../application/dto/chat-response.dto';
import { MessageResponseDto } from '../../application/dto/message-response.dto';

export const ApiCreateChat = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo chat' }),
    ApiResponse({ status: 201, type: ChatResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
  );

export const ApiReceiveMessage = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Processa uma mensagem de entrada e retorna a resposta do bot',
    }),
    ApiResponse({ status: 200, type: MessageResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({
      status: 404,
      description: 'Bot ou modelo GPT não encontrado',
    }),
  );
