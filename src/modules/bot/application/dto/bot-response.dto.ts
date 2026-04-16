import { ApiProperty } from '@nestjs/swagger';

export class BotResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'Atendimento' })
  name!: string;

  @ApiProperty({ example: 'support' })
  type!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  modelId!: string;

  @ApiProperty({ example: 'pt-BR' })
  language!: string;

  @ApiProperty({ example: '+5511999999999' })
  phoneNumber!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  userId!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
