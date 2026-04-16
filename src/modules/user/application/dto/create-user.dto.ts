import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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

  @ApiProperty({ example: 'senhaSegura123' })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string;
}
