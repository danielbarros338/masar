import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../../domain/message.types';

export class IncomingMessageDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'O botId não pode ser vazio' })
  botId: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsNotEmpty({ message: 'O phoneNumber não pode ser vazio' })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode ser vazia' })
  message: string;

  @ApiProperty({ enum: UserType, example: UserType.USER })
  @IsEnum(UserType, { message: 'userType inválido' })
  userType: UserType;
}
