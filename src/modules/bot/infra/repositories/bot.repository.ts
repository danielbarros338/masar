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

  async save(entity: BotEntity): Promise<void> {
    const orm = BotMapper.toPersistence(entity);
    await this.repo.save(orm);
  }
}
