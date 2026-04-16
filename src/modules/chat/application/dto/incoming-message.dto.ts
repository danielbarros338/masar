import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../../domain/message.types';

export class IncomingMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'O botId não pode ser vazio' })
  botId: string;

  @IsString()
  @IsNotEmpty({ message: 'O phoneNumber não pode ser vazio' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode ser vazia' })
  message: string;

  @IsEnum(UserType, { message: 'userType inválido' })
  userType: UserType;
}
