import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { EmailVerificationMessageDto } from '../../application/dto/email-verification-message.dto';

export const ApiLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Autentica um usuário e retorna tokens JWT' }),
    ApiResponse({
      status: 200,
      description: 'Autenticado com sucesso',
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: 200,
      description: 'E-mail pendente de verificação (token expirado ou não verificado)',
      type: EmailVerificationMessageDto,
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Credenciais inválidas' }),
  );

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cadastra um novo usuário e envia e-mail de confirmação' }),
    ApiResponse({ status: 201, type: EmailVerificationMessageDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 409, description: 'E-mail já cadastrado' }),
  );

export const ApiRefreshToken = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Renova o access token a partir do refresh token',
    }),
    ApiResponse({ status: 200, type: AuthResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({
      status: 401,
      description: 'Refresh token inválido ou expirado',
    }),
  );

export const ApiConfirmEmail = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Confirma o e-mail do usuário com o token de 4 dígitos e retorna tokens JWT',
    }),
    ApiResponse({ status: 200, type: AuthResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
    ApiResponse({ status: 422, description: 'Token inválido ou expirado' }),
  );
