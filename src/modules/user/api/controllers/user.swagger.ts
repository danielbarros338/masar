import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../../application/dto/user-response.dto';

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo usuário' }),
    ApiResponse({ status: 201, type: UserResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 409, description: 'E-mail já cadastrado' }),
  );

export const ApiChangePassword = () =>
  applyDecorators(
    ApiOperation({ summary: 'Altera a senha do usuário autenticado' }),
    ApiResponse({ status: 200, description: 'Senha alterada com sucesso' }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
    ApiResponse({
      status: 422,
      description: 'Senha já utilizada anteriormente',
    }),
  );
