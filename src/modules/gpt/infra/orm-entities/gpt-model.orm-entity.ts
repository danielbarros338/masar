import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gpt_models')
export class GptModelOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  provider!: string;

  @Column({ type: 'varchar', length: 100, name: 'model_id' })
  modelId!: string;

  @Column({ type: 'varchar', length: 150, name: 'display_name' })
  displayName!: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_default' })
  isDefault!: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_deprecated' })
  isDeprecated!: boolean;

  @Column({ type: 'boolean', default: true, name: 'supports_chats' })
  supportsChats!: boolean;

  @Column({ type: 'boolean', default: false, name: 'supports_streaming' })
  supportsStreaming!: boolean;

  @Column({ type: 'boolean', default: false, name: 'supports_reasoning' })
  supportsReasoning!: boolean;

  @Column({ type: 'boolean', default: false, name: 'supports_tools' })
  supportsTools!: boolean;

  @Column({ type: 'int', name: 'context_window' })
  contextWindow!: number;

  @Column({ type: 'int', name: 'max_output_tokens' })
  maxOutputTokens!: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'input_cost' })
  inputCost!: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'output_cost' })
  outputCost!: number;

  @Column({ type: 'int', name: 'speed_score' })
  speedScore!: number;

  @Column({ type: 'int', name: 'quality_score' })
  qualityScore!: number;

  @Column({ type: 'int' })
  priority!: number;

  @Column({ type: 'json', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
