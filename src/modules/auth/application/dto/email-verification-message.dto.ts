import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationMessageDto {
  @ApiProperty({
    description: 'Mensagem informando que o e-mail de confirmação foi enviado',
    example:
      'Enviamos uma confirmação de cadastro para seu email com um código de ativação. Insira o código para ativar a conta e continuar',
  })
  message!: string;
}
