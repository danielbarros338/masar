import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
const PASSWORD_MESSAGE =
  'Senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula e 1 caractere especial';

export class RegisterDto {
  @ApiProperty({ example: 'João' })
  @IsString()
  @IsNotEmpty({ message: 'O primeiro nome não pode ser vazio' })
  firstname!: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O sobrenome não pode ser vazio' })
  surname!: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty({ example: '1990-05-20' })
  @Type(() => Date)
  @IsDate({ message: 'Data de nascimento inválida' })
  birthdate!: Date;

  @ApiProperty({ example: 'Senha@123' })
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE })
  password!: string;
}
