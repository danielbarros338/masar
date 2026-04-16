import { RefreshTokenProps } from '../props/refresh-token.props';

export class RefreshTokenEntity {
  constructor(private readonly props: RefreshTokenProps) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get isRevoked(): boolean {
    return this.props.revokedAt != null;
  }
}
