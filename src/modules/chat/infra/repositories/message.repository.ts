import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IMessageRepository } from '../../application/ports/i-message.repository';
import { MessageEntity } from '../../domain/entities/message.entity';
import { MessageMapper } from '../mapper/message.mapper';
import { MessageOrmEntity } from '../orm-entities/message.orm-entity';

@Injectable()
export class MessageRepository extends IMessageRepository {
  constructor(
    @InjectRepository(MessageOrmEntity)
    private readonly repo: Repository<MessageOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<MessageEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? MessageMapper.toDomain(orm) : null;
  }

  async findByChatId(chatId: string): Promise<MessageEntity[]> {
    const orms = await this.repo.findBy({ chatId });
    return orms.map((orm) => MessageMapper.toDomain(orm));
  }

  async save(entity: MessageEntity): Promise<void> {
    const orm = MessageMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async saveWithManager(
    entity: MessageEntity,
    manager: EntityManager,
  ): Promise<void> {
    const orm = MessageMapper.toPersistence(entity);
    await manager.save(MessageOrmEntity, orm);
  }
}
