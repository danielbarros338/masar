import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { JwtUser } from '../../../../common/decorators/current-user.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { ChangePasswordDto } from '../../application/dto/change-password.dto';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ApiChangePassword, ApiCreateUser } from './user.swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateUser()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUser.execute(dto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  @ApiChangePassword()
  async changePassword(
    @CurrentUser() user: JwtUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.changePasswordUseCase.execute(user.sub, dto);
  }
}
