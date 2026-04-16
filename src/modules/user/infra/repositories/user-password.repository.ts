import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IUserPasswordRepository } from '../../application/ports/i-user-password.repository';
import { UserPasswordEntity } from '../../domain/entities/user-password.entity';
import { UserPasswordMapper } from '../mapper/user-password.mapper';
import { UserPasswordOrmEntity } from '../orm-entities/user-password.orm-entity';

@Injectable()
export class UserPasswordRepository extends IUserPasswordRepository {
  constructor(
    @InjectRepository(UserPasswordOrmEntity)
    private readonly repo: Repository<UserPasswordOrmEntity>,
  ) {
    super();
  }

  async save(entity: UserPasswordEntity): Promise<void> {
    const orm = UserPasswordMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async saveWithManager(
    entity: UserPasswordEntity,
    manager: EntityManager,
  ): Promise<void> {
    const orm = UserPasswordMapper.toPersistence(entity);
    await manager.save(UserPasswordOrmEntity, orm);
  }

  async findLatestByUserId(userId: string): Promise<UserPasswordEntity | null> {
    const orm = await this.repo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return orm ? UserPasswordMapper.toDomain(orm) : null;
  }

  async findAllByUserId(userId: string): Promise<UserPasswordEntity[]> {
    const orms = await this.repo.find({ where: { userId } });
    return orms.map((orm) => UserPasswordMapper.toDomain(orm));
  }
}
