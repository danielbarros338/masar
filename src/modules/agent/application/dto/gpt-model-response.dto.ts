import { ApiProperty } from '@nestjs/swagger';

export class GptModelResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'openai' })
  provider!: string;

  @ApiProperty({ example: 'gpt-4o' })
  modelId!: string;

  @ApiProperty({ example: 'GPT-4o' })
  displayName!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  isDefault!: boolean;

  @ApiProperty()
  isDeprecated!: boolean;

  @ApiProperty()
  supportsChats!: boolean;

  @ApiProperty()
  supportsStreaming!: boolean;

  @ApiProperty()
  supportsReasoning!: boolean;

  @ApiProperty()
  supportsTools!: boolean;

  @ApiProperty({ example: 128000 })
  contextWindow!: number;

  @ApiProperty({ example: 4096 })
  maxOutputTokens!: number;

  @ApiProperty({ example: 0.005 })
  inputCost!: number;

  @ApiProperty({ example: 0.015 })
  outputCost!: number;

  @ApiProperty()
  speedScore!: number;

  @ApiProperty()
  qualityScore!: number;

  @ApiProperty()
  priority!: number;
}
