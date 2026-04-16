import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatStatus } from '../../domain/message.types';

export class ChatResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  botId: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  phoneNumber: string | null | undefined;

  @ApiProperty({ enum: ChatStatus, example: ChatStatus.BOT })
  chatStatus: ChatStatus;

  @ApiProperty({ example: '2026-04-16T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-16T00:00:00.000Z' })
  updatedAt: Date;
}
