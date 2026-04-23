import { ApiProperty } from '@nestjs/swagger';

export class KnowledgeResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  botId!: string;

  @ApiProperty({ example: 'faq-001' })
  code!: string;

  @ApiProperty({
    example: 'Responda apenas perguntas relacionadas ao produto.',
  })
  behaviour!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
