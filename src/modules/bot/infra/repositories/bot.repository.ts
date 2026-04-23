import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBotRepository } from '../../application/ports/i-bot.repository';
import { BotEntity } from '../../domain/entities/bot.entity';
import { BotMapper } from '../mapper/bot.mapper';
import { BotOrmEntity } from '../orm-entities/bot.orm-entity';

@Injectable()
export class BotRepository extends IBotRepository {
  constructor(
    @InjectRepository(BotOrmEntity)
    private readonly repo: Repository<BotOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<BotEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? BotMapper.toDomain(orm) : null;
  }

  async findAllByUserId(userId: string): Promise<BotEntity[]> {
    const orms = await this.repo.findBy({ userId });
    return orms.map(BotMapper.toDomain);
  }

  async findByIdAndUserId(id: string, userId: string): Promise<BotEntity | null> {
    const orm = await this.repo.findOneBy({ id, userId });
    return orm ? BotMapper.toDomain(orm) : null;
  }

  async save(entity: BotEntity): Promise<void> {
    const orm = BotMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<BotEntity | null> {
    const orm = await this.repo.findOneBy({ phoneNumber });
    return orm ? BotMapper.toDomain(orm) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}

