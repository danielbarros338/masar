import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import type { StringValue } from 'ms';
import { RefreshTokenPayload, RefreshTokenResult } from '../types/jwt.types';

@Injectable()
export class JwtUtil {
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: string;
  private readonly refreshTtlMs: number;

  constructor(private readonly jwtService: JwtService) {
    this.refreshSecret = process.env.JWT_REFRESH_SECRET ?? '';
    if (!this.refreshSecret) {
      throw new Error('JwtUtil: JWT_REFRESH_SECRET não definido');
    }

    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
    this.refreshTtlMs = this.parseTtl(this.refreshExpiresIn);
  }

  signAccessToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  signRefreshToken(userId: string): RefreshTokenResult {
    const jti = randomUUID();
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);

    const token = this.jwtService.sign(
      { sub: userId, jti },
      {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn as StringValue,
      },
    );

    return { token, jti, expiresAt };
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  private parseTtl(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) {
      throw new Error(`JwtUtil: JWT_REFRESH_EXPIRES_IN inválido: "${value}"`);
    }

    const amount = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return amount * multipliers[unit];
  }
}
