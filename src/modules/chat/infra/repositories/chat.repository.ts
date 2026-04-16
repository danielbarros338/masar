import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IChatRepository } from '../../application/ports/i-chat.repository';
import { ChatEntity } from '../../domain/entities/chat.entity';
import { ChatMapper } from '../mapper/chat.mapper';
import { ChatOrmEntity } from '../orm-entities/chat.orm-entity';

@Injectable()
export class ChatRepository extends IChatRepository {
  constructor(
    @InjectRepository(ChatOrmEntity)
    private readonly repo: Repository<ChatOrmEntity>,
  ) {
    super();
  }

  async findById(id: string): Promise<ChatEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? ChatMapper.toDomain(orm) : null;
  }

  async save(entity: ChatEntity): Promise<void> {
    const orm = ChatMapper.toPersistence(entity);
    await this.repo.save(orm);
  }
}
