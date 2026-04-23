import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../domain/message.types';

export class MessageResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  chatId: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: UserType, example: UserType.USER })
  userType: UserType;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
