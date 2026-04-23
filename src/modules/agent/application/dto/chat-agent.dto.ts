import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatAgentDto {
  @ApiProperty({ example: 'Explique o que é machine learning' })
  @IsString()
  @IsNotEmpty({ message: 'O prompt não pode ser vazio' })
  prompt!: string;

  @ApiPropertyOptional({ example: 'gpt-4o' })
  @IsString()
  @IsOptional()
  modelId?: string;
}
