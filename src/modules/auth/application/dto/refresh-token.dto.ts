import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token JWT' })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token não pode ser vazio' })
  refreshToken!: string;
}
