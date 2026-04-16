import { Injectable } from '@nestjs/common';
import { JwtUtil } from '../../../common/utils/jwt.util';
import { RefreshTokenEntity } from '../domain/entities/refresh-token.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { IRefreshTokenRepository } from './ports/i-refresh-token.repository';

@Injectable()
export class IssueTokensService {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async issue(userId: string, email: string): Promise<AuthResponseDto> {
    const accessToken = this.jwtUtil.signAccessToken(userId, email);
    const {
      token: refreshToken,
      jti,
      expiresAt,
    } = this.jwtUtil.signRefreshToken(userId);

    await this.refreshTokenRepository.save(
      new RefreshTokenEntity({
        id: jti,
        userId,
        expiresAt,
        revokedAt: null,
        createdAt: new Date(),
      }),
    );

    return { accessToken, refreshToken };
  }
}
