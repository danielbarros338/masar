import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IUserRepository } from '../../application/ports/i-user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mapper/user.mapper';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const orm = await this.repo.findOneBy({ email });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async save(entity: UserEntity): Promise<void> {
    const orm = UserMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async saveWithManager(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<void> {
    const orm = UserMapper.toPersistence(entity);
    await manager.save(UserOrmEntity, orm);
  }
}
