import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'João' })
  firstname!: string;

  @ApiProperty({ example: 'Silva' })
  surname!: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  email!: string;

  @ApiProperty({ example: '1990-05-20T00:00:00.000Z' })
  birthdate!: Date;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  emailVerified!: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
