import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRefreshTokenRepository } from '../../application/ports/i-refresh-token.repository';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenMapper } from '../mapper/refresh-token.mapper';
import { RefreshTokenOrmEntity } from '../orm-entities/refresh-token.orm-entity';

@Injectable()
export class RefreshTokenRepository extends IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {
    super();
  }

  async save(entity: RefreshTokenEntity): Promise<void> {
    const orm = RefreshTokenMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<RefreshTokenEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? RefreshTokenMapper.toDomain(orm) : null;
  }

  async revoke(id: string): Promise<void> {
    await this.repo.update(id, { revokedAt: new Date() });
  }
}
