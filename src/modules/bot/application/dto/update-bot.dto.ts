import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBotDto {
  @ApiPropertyOptional({ example: 'Atendimento' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'support' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsOptional()
  @IsUUID('4')
  modelId?: string;

  @ApiPropertyOptional({ example: 'pt-BR' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  language?: string;

  @ApiPropertyOptional({ example: 'Você é um assistente prestativo e amigável.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  persona?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;
}
