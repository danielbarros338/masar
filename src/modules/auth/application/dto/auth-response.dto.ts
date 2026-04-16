import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT (expira em 15 minutos)' })
  accessToken!: string;

  @ApiProperty({ description: 'Token de atualização JWT (expira em 7 dias)' })
  refreshToken!: string;
}
