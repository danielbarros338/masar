import { ApiProperty } from '@nestjs/swagger';

export class SyncAiModelsResponseDto {
  @ApiProperty({ example: ['gpt-4o', 'gpt-4-turbo'] })
  addedModels!: string[];
}
