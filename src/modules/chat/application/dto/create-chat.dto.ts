import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty({ message: 'O botId não pode ser vazio' })
  botId: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
