import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserType } from '../../domain/message.types';

export class CreateMessageDto {
  @IsUUID()
  chatId: string;

  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode ser vazia' })
  message: string;

  @IsEnum(UserType, { message: 'userType inválido' })
  userType: UserType;
}
