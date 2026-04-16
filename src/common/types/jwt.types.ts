export type AccessTokenPayload = { sub: string; email: string };

export type RefreshTokenPayload = { sub: string; jti: string };

export type RefreshTokenResult = {
  token: string;
  jti: string;
  expiresAt: Date;
};

/** Alias de AccessTokenPayload — representa o usuário autenticado disponível na request. */
export type JwtUser = AccessTokenPayload;
