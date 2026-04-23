import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class WhatsappMessageContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'TEXT' })
  @IsString()
  @IsNotEmpty()
  type: string;
}

class WhatsappInboundResultDto {
  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ example: '+5511888888888' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ type: () => WhatsappMessageContentDto })
  @ValidateNested()
  @Type(() => WhatsappMessageContentDto)
  message: WhatsappMessageContentDto;
}

export class IncomingWhatsappMessageDto {
  @ApiProperty({ type: () => [WhatsappInboundResultDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsappInboundResultDto)
  results: WhatsappInboundResultDto[];
}
