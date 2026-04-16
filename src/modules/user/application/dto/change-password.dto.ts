import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
const PASSWORD_MESSAGE =
  'A nova senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula e 1 caractere especial';

export class ChangePasswordDto {
  @ApiProperty({ example: 'SenhaAtual@123' })
  @IsString()
  @IsNotEmpty({ message: 'Senha atual não pode ser vazia' })
  currentPassword!: string;

  @ApiProperty({ example: 'NovaSenha@456' })
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  newPassword!: string;
}
