import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatStatus } from '../../domain/message.types';

@Entity('chats')
export class ChatOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'bot_id' })
  botId!: string;

  @Column({ type: 'varchar', length: 20, name: 'phone_number', nullable: true })
  phoneNumber!: string | null;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    name: 'chat_status',
    default: ChatStatus.BOT,
  })
  chatStatus!: ChatStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
