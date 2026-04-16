import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatGptDto {
  @ApiProperty({ example: 'Explique o que é machine learning' })
  @IsString()
  @IsNotEmpty({ message: 'O prompt não pode ser vazio' })
  prompt!: string;

  @ApiProperty({ example: 'gpt-4o', required: false })
  @IsString()
  @IsOptional()
  modelId?: string;
}
