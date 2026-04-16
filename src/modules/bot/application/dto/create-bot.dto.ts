import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBotDto {
  @ApiProperty({ example: 'Atendimento' })
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name!: string;

  @ApiProperty({ example: 'support' })
  @IsString()
  @IsNotEmpty({ message: 'O tipo não pode ser vazio' })
  type!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID('4', { message: 'modelId deve ser um UUID válido' })
  modelId!: string;

  @ApiProperty({ example: 'pt-BR' })
  @IsString()
  @IsNotEmpty({ message: 'O idioma não pode ser vazio' })
  language!: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsNotEmpty({ message: 'O número de telefone não pode ser vazio' })
  phoneNumber!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID('4', { message: 'userId deve ser um UUID válido' })
  userId!: string;
}
