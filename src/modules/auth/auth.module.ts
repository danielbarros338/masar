import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './api/controllers/auth.controller';
import { IssueTokensService } from './application/issue-tokens.service';
import { IRefreshTokenRepository } from './application/ports/i-refresh-token.repository';
import { ConfirmEmailUseCase } from './application/use-cases/confirm-email.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { RefreshTokenOrmEntity } from './infra/orm-entities/refresh-token.orm-entity';
import { RefreshTokenRepository } from './infra/repositories/refresh-token.repository';
import { JwtStrategy } from './infra/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    CommonModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    ConfirmEmailUseCase,
    IssueTokensService,
    JwtStrategy,
    { provide: IRefreshTokenRepository, useClass: RefreshTokenRepository },
  ],
})
export class AuthModule {}
