import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';

export abstract class IRefreshTokenRepository {
  abstract save(entity: RefreshTokenEntity): Promise<void>;
  abstract findById(id: string): Promise<RefreshTokenEntity | null>;
  abstract revoke(id: string): Promise<void>;
}
