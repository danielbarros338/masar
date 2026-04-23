import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('bots')
export class BotOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 36, name: 'gpt_model_id' })
  modelId!: string;

  @Column({ type: 'varchar', length: 20 })
  language!: string;

  @Column({ type: 'text' })
  persona!: string;

  @Column({ type: 'varchar', length: 20, name: 'phone_number' })
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 36, name: 'user_id' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
