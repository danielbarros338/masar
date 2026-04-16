import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGptModelRepository } from '../../application/ports/i-gpt-model.repository';
import { GptModelEntity } from '../../domain/entities/gpt-model.entity';
import { GptModelMapper } from '../mapper/gpt-model.mapper';
import { GptModelOrmEntity } from '../orm-entities/gpt-model.orm-entity';

@Injectable()
export class GptModelRepository extends IGptModelRepository {
  constructor(
    @InjectRepository(GptModelOrmEntity)
    private readonly repo: Repository<GptModelOrmEntity>,
  ) {
    super();
  }

  async findAll(): Promise<GptModelEntity[]> {
    const orms = await this.repo.find({ order: { priority: 'DESC' } });
    return orms.map((orm) => GptModelMapper.toDomain(orm));
  }

  async findById(id: string): Promise<GptModelEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? GptModelMapper.toDomain(orm) : null;
  }

  async findByModelId(modelId: string): Promise<GptModelEntity | null> {
    const orm = await this.repo.findOneBy({ modelId });
    return orm ? GptModelMapper.toDomain(orm) : null;
  }

  async findDefault(): Promise<GptModelEntity | null> {
    const orm = await this.repo.findOneBy({ isDefault: true, isActive: true });
    return orm ? GptModelMapper.toDomain(orm) : null;
  }

  async findAllModelIds(): Promise<string[]> {
    const models = await this.repo.find({
      select: { modelId: true },
      withDeleted: true,
    });
    return models.map((m) => m.modelId);
  }

  async save(entity: GptModelEntity): Promise<void> {
    const orm = GptModelMapper.toPersistence(entity);
    await this.repo.save(orm);
  }

  async saveMany(entities: GptModelEntity[]): Promise<void> {
    const orms = entities.map((e) => GptModelMapper.toPersistence(e));
    await this.repo.save(orms);
  }
}
