import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateKnowledgeDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID('4', { message: 'botId deve ser um UUID válido' })
  botId!: string;

  @ApiProperty({ example: 'faq-001' })
  @IsString()
  @IsNotEmpty({ message: 'O código não pode ser vazio' })
  code!: string;

  @ApiProperty({
    example: 'Responda apenas perguntas relacionadas ao produto.',
  })
  @IsString()
  @IsNotEmpty({ message: 'O comportamento não pode ser vazio' })
  behaviour!: string;
}
