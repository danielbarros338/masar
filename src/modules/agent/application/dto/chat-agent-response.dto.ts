import { ApiProperty } from '@nestjs/swagger';

export class ChatAgentResponseDto {
  @ApiProperty()
  response!: string;

  @ApiProperty({ example: 'gpt-4o' })
  modelId!: string;
}
