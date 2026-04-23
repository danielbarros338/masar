import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateKnowledgeDto {
  @ApiPropertyOptional({ example: 'faq-002' })
  @IsString()
  @IsNotEmpty({ message: 'O código não pode ser vazio' })
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    example: 'Responda apenas perguntas sobre suporte técnico.',
  })
  @IsString()
  @IsNotEmpty({ message: 'O comportamento não pode ser vazio' })
  @IsOptional()
  behaviour?: string;
}
