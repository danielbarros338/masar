import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../common/decorators/public.decorator';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { ConfirmEmailDto } from '../../application/dto/confirm-email.dto';
import { EmailVerificationMessageDto } from '../../application/dto/email-verification-message.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { ConfirmEmailUseCase } from '../../application/use-cases/confirm-email.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import {
  ApiConfirmEmail,
  ApiLogin,
  ApiRefreshToken,
  ApiRegister,
} from './auth.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly register: RegisterUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly confirmEmail: ConfirmEmailUseCase,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async loginUser(
    @Body() dto: LoginDto,
  ): Promise<AuthResponseDto | EmailVerificationMessageDto> {
    return this.login.execute(dto);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async registerUser(
    @Body() dto: RegisterDto,
  ): Promise<EmailVerificationMessageDto> {
    return this.register.execute(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiRefreshToken()
  async refreshUserToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.refreshToken.execute(dto);
  }

  @Post('confirm-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiConfirmEmail()
  async confirmUserEmail(
    @Body() dto: ConfirmEmailDto,
  ): Promise<AuthResponseDto> {
    return this.confirmEmail.execute(dto);
  }
}
