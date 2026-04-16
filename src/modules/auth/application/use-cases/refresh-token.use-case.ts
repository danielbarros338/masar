import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtUtil } from '../../../../common/utils/jwt.util';
import { IUserRepository } from '../../../user/application/ports/i-user.repository';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { IssueTokensService } from '../issue-tokens.service';
import { IRefreshTokenRepository } from '../ports/i-refresh-token.repository';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtUtil: JwtUtil,
    private readonly issueTokensService: IssueTokensService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const payload = this.jwtUtil.verifyRefreshToken(dto.refreshToken);

    const storedToken = await this.refreshTokenRepository.findById(payload.jti);
    if (!storedToken || storedToken.isRevoked) {
      throw new UnauthorizedException('Refresh token inválido ou revogado');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    await this.refreshTokenRepository.revoke(storedToken.id);

    return this.issueTokensService.issue(user.id, user.email);
  }
}
