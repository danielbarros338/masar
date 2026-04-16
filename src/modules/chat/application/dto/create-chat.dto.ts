import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'O botId não pode ser vazio' })
  botId: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
